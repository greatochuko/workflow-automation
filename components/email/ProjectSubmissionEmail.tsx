import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";
import { render } from "@react-email/render";
import { CSSProperties } from "react";

export default function ProjectSubmissionEmail({
  clientName,
  freelancerName,
  projectTitle,
  projectLink,
}: {
  clientName: string;
  freelancerName: string;
  projectTitle: string;
  projectLink: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>
        {freelancerName} submitted your project: {projectTitle}
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
            ✅ Project Submitted by Freelancer
          </Heading>
          <Text style={styles.paragraph}>Hi {clientName},</Text>
          <Text style={styles.paragraph}>
            The project: <strong>{projectTitle}</strong> has been completed and
            submitted.
          </Text>
          <Button href={projectLink} style={styles.button}>
            View Submission
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

export const renderProjectSubmissionEmail = async ({
  clientName,
  freelancerName,
  projectTitle,
  projectLink,
}: {
  clientName: string;
  freelancerName: string;
  projectTitle: string;
  projectLink: string;
}) =>
  await render(
    <ProjectSubmissionEmail
      clientName={clientName}
      freelancerName={freelancerName}
      projectTitle={projectTitle}
      projectLink={projectLink}
    />,
  );
