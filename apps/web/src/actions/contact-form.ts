"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success?: boolean;
  error?: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

// Validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateFormData(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): ContactFormState["errors"] | null {
  const errors: ContactFormState["errors"] = {};

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = ["Name must be at least 2 characters"];
  } else if (data.name.length > 100) {
    errors.name = ["Name must be less than 100 characters"];
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = ["Please enter a valid email address"];
  }

  // Subject validation
  if (data.subject && data.subject.length > 200) {
    errors.subject = ["Subject must be less than 200 characters"];
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.message = ["Message must be at least 10 characters"];
  } else if (data.message.length > 5000) {
    errors.message = ["Message must be less than 5000 characters"];
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    // Extract form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string | undefined;
    const message = formData.get("message") as string;

    // Validate form data
    const errors = validateFormData({ name, email, subject, message });

    if (errors) {
      return {
        success: false,
        errors,
      };
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Flyball Hub <onboarding@resend.dev>", // Using Resend's test domain - verify flyballhub.com in Resend to use contact@flyballhub.com
      to: ["flyballhub@gmail.com"],
      replyTo: email,
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ""}

Message:
${message}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: "Failed to send message. Please try again later.",
      };
    }

    console.log("Email sent successfully:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
