"use server";

import { renderProjectCreationEmail } from "@/components/email/ProjectCreationEmail";
import { renderProjectFeedbackEmail } from "@/components/email/ProjectFeedbackEmail";
import { renderProjectSubmissionEmail } from "@/components/email/ProjectSubmissionEmail";
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
      subject: `New Project Created: ${projectTitle}`,
      html: await renderProjectCreationEmail({
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
    console.log("Error sending creation email: ", error.message);
    return { data: false, error: "Server Error" };
  }
}

export async function sendProjectSubmissionEmail({
  freelancerName,
  clientEmail,
  projectTitle,
  clientName,
}: {
  projectTitle: string;
  freelancerName: string;
  clientEmail: string;
  clientName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@clinicleadstack.com",
      to: clientEmail,
      subject: `Project Submitted: ${projectTitle}`,
      html: await renderProjectSubmissionEmail({
        freelancerName,
        clientName,
        projectLink: "https://www.clinicleadstack.com/",
        projectTitle,
      }),
    });

    if (error) throw new Error(error.message);

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    console.log("Error sending submission email: ", error.message);
    return { data: false, error: "Server Error" };
  }
}

export async function sendProjectFeedbackEmail({
  freelancerName,
  freelancerEmail,
  projectTitle,
  clientName,
  status,
  feedback,
}: {
  projectTitle: string;
  freelancerName: string;
  freelancerEmail: string;
  clientName: string;
  status: "approved" | "rejected";
  feedback?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@clinicleadstack.com",
      to: freelancerEmail,
      subject: `Project Submitted: ${projectTitle}`,
      html: await renderProjectFeedbackEmail({
        status,
        feedback,
        freelancerName,
        clientName,
        projectLink: "https://www.clinicleadstack.com/",
        projectTitle,
      }),
    });

    if (error) throw new Error(error.message);

    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    console.log("Error sending feedback email: ", error.message);
    return { data: false, error: "Server Error" };
  }
}
