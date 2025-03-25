import React from 'react';

import { UserPlus, Camera, ShoppingBag } from "lucide-react"

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus size={32} />,
      title: "Sign Up",
      description: "Create your account in seconds using your student email",
      
    },
    {
      icon: <Camera size={32} />,
      title: "List an Item",
      description: "Take photos and list your items for sale in minutes",
    },
    {
      icon: <ShoppingBag size={32} />,
      title: "Buy & Sell",
      description: "Find great deals and chat with sellers on campus",
    },
  ]

  return (
    <section style={{ padding: "80px 0", backgroundColor: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "#2d3748", marginBottom: "60px" }}>How It Works</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#ebf8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4299e1",
                  marginBottom: "24px",
                }}
              >
                {step.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#2d3748",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#718096",
                  lineHeight: "1.6",
                  maxWidth: "250px",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

