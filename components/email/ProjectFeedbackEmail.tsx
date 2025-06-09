import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Button,
  Section,
} from "@react-email/components";
import { render } from "@react-email/render";
import { CSSProperties } from "react";

export default function ProjectFeedbackEmail({
  freelancerName,
  clientName,
  projectTitle,
  status,
  feedback,
  projectLink,
}: {
  freelancerName: string;
  clientName: string;
  projectTitle: string;
  status: "approved" | "rejected";
  feedback?: string;
  projectLink: string;
}) {
  const isApproved = status === "approved";

  return (
    <Html>
      <Head />
      <Preview>
        Your project &quot;{projectTitle}&quot; was {status} by {clientName}
      </Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading
            style={{
              fontSize: "20px",
              color: "#4f46e5",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Clinic Lead Stack
          </Heading>
          <Heading as="h2" style={styles.heading}>
            {isApproved ? "🎉 Project Approved" : "❌ Project Rejected"}
          </Heading>
          <Text style={styles.paragraph}>Hi {freelancerName},</Text>
          <Text style={styles.paragraph}>
            <strong>{clientName}</strong> has {status} your submission for the
            project: <strong>{projectTitle}</strong>.
          </Text>

          {feedback && (
            <Section style={styles.section}>
              <Text style={styles.label}>💬 Client Feedback:</Text>
              <Text style={styles.description}>{feedback}</Text>
            </Section>
          )}

          <Button href={projectLink} style={styles.button}>
            {isApproved ? "View Final Project" : "Review Submission"}
          </Button>

          <Text style={styles.footer}>
            Thanks,
            <br />
            The Clinic Lead Stack Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    backgroundColor: "#f4f4f4",
    padding: "40px 5%",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    margin: "0 auto",
    padding: "32px",
    maxWidth: "520px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },

  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#111827",
  },

  paragraph: {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#333",
    marginBottom: "16px",
  },

  label: {
    fontSize: "16px",
    color: "#1f2937",
    marginBottom: "4px",
  },

  description: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.5",
    backgroundColor: "#f9fafb",
    padding: "12px",
    borderRadius: "6px",
    marginTop: "4px",
  },

  section: {
    marginTop: "20px",
    marginBottom: "30px",
  },

  button: {
    backgroundColor: "#4739ea",
    color: "#ffffff",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "6px",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 500,
  },

  footer: {
    marginTop: "40px",
    fontSize: "14px",
    color: "#999999",
  },
};

export const renderProjectFeedbackEmail = async ({
  freelancerName,
  clientName,
  projectTitle,
  status,
  feedback,
  projectLink,
}: {
  freelancerName: string;
  clientName: string;
  projectTitle: string;
  status: "approved" | "rejected";
  feedback?: string;
  projectLink: string;
}) =>
  await render(
    <ProjectFeedbackEmail
      freelancerName={freelancerName}
      clientName={clientName}
      projectTitle={projectTitle}
      status={status}
      feedback={feedback}
      projectLink={projectLink}
    />,
  );
