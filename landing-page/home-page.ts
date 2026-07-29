import { Request, Response, Router } from "express";
const homeRoute = Router();

homeRoute.get("/", (req: Request, res: Response) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Fix It Now API</title>

        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .container {
            width: 100%;
            max-width: 800px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 48px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          }

          .badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 8px 14px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
          }

          h1 {
            font-size: 42px;
            margin-bottom: 12px;
            color: #0f172a;
          }

          h2 {
            font-size: 22px;
            font-weight: 500;
            color: #475569;
            margin-bottom: 24px;
          }

          p {
            font-size: 17px;
            line-height: 1.7;
            color: #64748b;
            margin-bottom: 32px;
          }

          .section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
          }

          .section h3 {
            font-size: 18px;
            margin-bottom: 16px;
            color: #0f172a;
          }

          .tech-stack {
            line-height: 1.8;
            color: #475569;
          }

          .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .feature {
            padding: 12px 16px;
            background: #f8fafc;
            border-radius: 8px;
            color: #475569;
          }

          .links {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 16px;
          }

          .links a {
            display: inline-block;
            padding: 12px 18px;
            background: #0f172a;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          }

          .links a:hover {
            opacity: 0.85;
          }

          footer {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #94a3b8;
          }

          @media (max-width: 600px) {
            .container {
              padding: 28px;
            }

            h1 {
              font-size: 32px;
            }

            .features {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>

      <body>
        <main class="container">
          <span class="badge">● API is running</span>

          <h1>Fix It Now API</h1>

          <h2>Home Service Booking Platform Backend</h2>

          <p>
            A RESTful backend API that connects customers with verified
            technicians for home services. The platform handles authentication,
            technician verification, service management, bookings, Stripe
            payments, and customer reviews.
          </p>

          <section class="section">
            <h3>Technology Stack</h3>

            <div class="tech-stack">
              Node.js · Express.js · TypeScript · PostgreSQL · Prisma ORM ·
              JWT · Zod · Stripe
            </div>
          </section>

          <section class="section">
            <h3>Core Features</h3>

            <div class="features">
              <div class="feature">JWT Authentication</div>
              <div class="feature">Role-Based Authorization</div>
              <div class="feature">Technician Verification</div>
              <div class="feature">Service Management</div>
              <div class="feature">Booking Management</div>
              <div class="feature">Booking Availability Validation</div>
              <div class="feature">Stripe Payments & Webhooks</div>
              <div class="feature">Reviews & Ratings</div>
            </div>
          </section>

          <section class="section">
            <h3>Resources</h3>

            <div class="links">
              <a
                href="https://documenter.getpostman.com/view/53393171/2sBY4LQ2Ci"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Documentation
              </a>

              <a
                href="https://github.com/Newton2n/fix-it-now-backend"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </div>
          </section>

          <footer>
            Fix It Now Backend API · Built with Node.js, Express.js,
            TypeScript, PostgreSQL & Prisma
          </footer>
        </main>
      </body>
    </html>
  `);
});

export default homeRoute;
