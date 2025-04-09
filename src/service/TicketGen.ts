import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs-extra";
import path from "path";
import fetch from "node-fetch";

export interface TicketData {
  plate_number: string;
  plate_province: string;
  kor_har: string;
  place: string;
  violation_datetime: Date;
  violation_detail: string;
  ticket_number: string;
  fine: string;
  issuer: string;
  issue_datetime: Date;
  evidence_1_path?: string; // Can be local file path or HTTP URL
  evidence_2_path?: string; // Can be local file path or HTTP URL
}

export class TicketGenerator {
  private fontPath: string;

  constructor() {
    this.fontPath = path.join(__dirname, "../assets/fonts/THSarabunNew.ttf");
  }

  /**
   * Converts a violation into a filled PDF ticket
   * @param data The ticket data
   * @param templatePath Path to the PDF template
   * @param outputPath Path where the filled PDF should be saved
   */
  public async generateTicket(
    data: TicketData,
    templatePath: string,
    outputPath: string
  ): Promise<string> {
    try {
      const pdfBytes = await this.generateTicketInternal(data, templatePath);

      // Save the filled PDF
      await fs.writeFile(outputPath, pdfBytes);

      return outputPath;
    } catch (error) {
      console.error("Error generating ticket:", error);
      throw error;
    }
  }

  /**
   * Converts a violation into a filled PDF ticket and returns it as a buffer
   * @param data The ticket data
   * @param templatePath Path to the PDF template
   * @returns Buffer containing the PDF data
   */
  public async generateTicketAsBuffer(
    data: TicketData,
    templatePath: string
  ): Promise<Buffer> {
    try {
      const pdfBytes = await this.generateTicketInternal(data, templatePath);
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error("Error generating ticket as buffer:", error);
      throw error;
    }
  }

  //   as byte
  public async generateTicketAsBytes(
    data: TicketData,
    templatePath: string
  ): Promise<Uint8Array> {
    const pdfBytes = await this.generateTicketInternal(data, templatePath);
    return pdfBytes;
  }

  /**
   * Internal method that handles the actual PDF generation logic
   * @param data The ticket data
   * @param templatePath Path to the PDF template
   * @returns Uint8Array containing the PDF data
   */
  private async generateTicketInternal(
    data: TicketData,
    templatePath: string
  ): Promise<Uint8Array> {
    // Read the template PDF file
    const templateBuffer = await fs.readFile(templatePath);
    const templateBytes = new Uint8Array(templateBuffer);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    // Load the Thai font
    const fontExists = await fs.pathExists(this.fontPath);

    if (!fontExists) {
      throw new Error(`Thai font not found at: ${this.fontPath}`);
    }

    const fontBuffer = await fs.readFile(this.fontPath);
    const fontBytes = new Uint8Array(fontBuffer);
    const customFont = await pdfDoc.embedFont(fontBytes);

    // Get the form fields
    const form = pdfDoc.getForm();

    // Override the default font for all form fields
    const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
    form.updateFieldAppearances = function () {
      return rawUpdateFieldAppearances(customFont);
    };

    // Fill text fields
    const fields = {
      plate_number: data.plate_number,
      plate_province: data.plate_province,
      kor_har: data.kor_har,
      place: data.place,
      violation_datetime: this.formatDate(data.violation_datetime),
      violation_detail: data.violation_detail,
      ticket_number: data.ticket_number,
      fine: data.fine,
      issuer: data.issuer,
      issue_datetime: this.formatDate(data.issue_datetime),
    };

    // Fill text fields with Thai font
    for (const [fieldName, value] of Object.entries(fields)) {
      try {
        const field = form.getTextField(fieldName);
        if (field) {
          field.setFontSize(11);
          field.updateAppearances(customFont);
          field.setText(value);
        } else {
          console.warn(`Field not found: ${fieldName}`);
        }
      } catch (err) {
        console.warn(`Error setting field ${fieldName}:`, err);
      }
    }

    // Handle evidence images
    if (data.evidence_1_path) {
      await this.embedImage(
        pdfDoc,
        form,
        "evidence_1_af_image",
        data.evidence_1_path
      );
    }

    if (data.evidence_2_path) {
      await this.embedImage(
        pdfDoc,
        form,
        "evidence_2_af_image",
        data.evidence_2_path
      );
    }

    // Flatten the form (makes it non-editable)
    form.flatten();

    // Return the PDF bytes
    return await pdfDoc.save();
  }

  /**
   * Embeds an image into a PDF form field
   */
  private async embedImage(
    pdfDoc: PDFDocument,
    form: any,
    fieldName: string,
    imagePath: string
  ): Promise<void> {
    try {
      // First check if the file exists (for local paths)
      if (!imagePath.startsWith("http")) {
        const exists = await fs.pathExists(imagePath);
        if (!exists) {
          console.warn(`Image file not found: ${imagePath}`);
          return;
        }
      }

      let imageBytes: Uint8Array;

      // Handle URLs or local file paths
      if (imagePath.startsWith("http")) {
        const response = await fetch(imagePath);
        const arrayBuffer = await response.arrayBuffer();
        imageBytes = new Uint8Array(arrayBuffer);
      } else {
        const imageBuffer = await fs.readFile(imagePath);
        imageBytes = new Uint8Array(imageBuffer);
      }

      // Determine image type and embed accordingly
      let image;
      if (imagePath.toLowerCase().endsWith(".png")) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (
        imagePath.toLowerCase().endsWith(".jpg") ||
        imagePath.toLowerCase().endsWith(".jpeg")
      ) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        throw new Error(`Unsupported image format: ${imagePath}`);
      }

      // Get the field and set the image
      const field = form.getButton(fieldName);
      if (field) {
        field.setImage(image);
      } else {
        console.warn(`Image field not found: ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error embedding image in field ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Format date for PDF form fields
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

async function main() {
  try {
    // Example ticket data
    const ticketData: TicketData = {
      plate_number: "กก 123",
      plate_province: "Bangkok",
      kor_har: "KB 1234",
      place: "Rama 4 Road",
      violation_datetime: new Date(),
      violation_detail: "Parking violation",
      ticket_number: "T12345678",
      fine: "500",
      issuer: "Officer A",
      issue_datetime: new Date(),
      // Example of using an HTTP URL for evidence_1_path
      evidence_1_path: "https://picsum.photos/200/300.jpg",
      // Local file path for evidence_2_path
      // evidence_2_path: path.join(
      //     __dirname,
      //     "../sample_images/evidence2.jpg",
      // ),
    };

    const templatePath = path.join(__dirname, "../assets/ticket_template.pdf");
    const outputPath = path.join(__dirname, "../filled_ticket.pdf");

    const ticketGenerator = new TicketGenerator();
    const filledTicketPath = await ticketGenerator.generateTicket(
      ticketData,
      templatePath,
      outputPath
    );

    console.log(`Ticket generated successfully: ${filledTicketPath}`);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main().then(() => {
  console.log("Done");
});
