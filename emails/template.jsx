import { Body, Button, Html, Preview, Head,Section,Text,Container, Heading } from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
    userName = "",
    type= "monthly-report",
    data= {},


}) {
  
    if(type === "monthly-report"){
        return (
        <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

          
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>${data?.stats.totalIncome}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>${data?.stats.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  ${data?.stats.totalIncome - data?.stats.totalExpenses}
                </Text>
              </div>
            </Section>

        
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{category}</Text>
                      <Text style={styles.text}>${amount}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

         
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Khaata Booky Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Khaata Booky. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
        )
    }

    if(type=== "budget-alert"){
        return (
    <Html>
      <Head/>
      <Preview>Budget Alert</Preview>
      <Body style={styles.body}>
         <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used {Number(data?.percentageUsed || 0).toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>${data?.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>${data?.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ${data?.budgetAmount - data?.totalExpenses}
                </Text>
              </div>
            </Section>
          </Container>
      </Body>
    </Html>
  );
}
}  


/*const styles = {
    body : {
        backgroundColor : "#f6f9fc",
        fontFamily :"-apple-system, sans-serif"
    },
     container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
}  */



const styles = {
  body: {
    backgroundColor: "#f3f4f6", // Softer gray for email background
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    margin: "0",
    padding: "20px",
    lineHeight: "1.6",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "32px",
    maxWidth: "600px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // softer shadow for depth
  },
  title: {
    color: "#1e3a8a", // Indigo for professional look
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 24px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  heading: {
    color: "#1f2937", // Dark gray for section headings
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "8px",
  },
  text: {
    color: "#374151", // Darker gray for better readability
    fontSize: "16px",
    margin: "0 0 12px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb", // very light gray for separation
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr", // for better layout in clients that support it
    gap: "12px",
  },
  stat: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    fontSize: "16px",
    fontWeight: "500",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "15px",
    color: "#4b5563",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
