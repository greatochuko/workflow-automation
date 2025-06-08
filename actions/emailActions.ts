"use server";

import { createProjectEmail } from "@/components/email/CreateProjectEmail";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) throw new Error("Invalid Resend API Key!");

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendProjectCreationEmail({
  freelancerName,
  freelancerEmail,
  projectTitle,
  projectDescription,
  clientName,
}: {
  projectTitle: string;
  projectDescription: string;
  freelancerName: string;
  freelancerEmail: string;
  clientName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@clinicleadstack.com",
      to: freelancerEmail,
      subject: `New Project Submitted: ${projectTitle}`,
      html: await createProjectEmail({
        freelancerName,
        clientName,
        projectDescription,
        projectLink: "https://www.clinicleadstack.com/",
        projectTitle,
      }),
    });

    if (error) throw new Error(error.message);

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    console.log("Error sending email: ", error.message);
    return { data: false, error: "Server Error" };
  }
}
