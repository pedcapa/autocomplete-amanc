# **Datamatic - Automating Document Management for AMANC**

**Datamatic** is a document digitalization and automation solution designed to streamline the registration and data entry process at AMANC (or similar organizations). The application allows users to upload physical documents, which are then analyzed and converted into digital data automatically, saving time and improving data accuracy.

## **Table of Contents**

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## **Problem Statement**

AMANC and similar organizations often deal with a large number of documents and patient registrations. The lack of a fully digital and automated system results in inefficiencies, loss of time, and potential errors in data entry.

The current system relies heavily on manual data entry using Excel sheets, which complicates real-time updates and personalized service.

## **Features**

- **User Authentication (New)**: Login functionality with session management ensures only authorized users can access the registration form.
- **Image Upload and Analysis**: Upload an image of a document, and the system will automatically extract relevant data, reducing the need for manual entry.
- **Form Autofill**: After analyzing a document, the extracted data is used to populate the registration form automatically.
- **Form Submission Confirmation (New)**: After submitting the form, users are redirected to a confirmation page that verifies successful submission.
- **Logout Option (New)**: Users can securely log out from the form and confirmation pages.
- **Real-time Updates**: When any data is modified, it will update across the entire system in real-time.
- **QR Code Integration (Planned)**: Generate QR codes for physical documents, linking them to their digital records for easy access and retrieval.

## **Installation**

To set up this project locally, follow these steps:

### **Prerequisites**

- Node.js (v14 or above)
- Git

### **Steps**

1. Clone the repository:
   ```bash
   git clone https://github.com/pedcapa/datamatic-amanc.git
   ```
2. Navigate to the project directory:
   ```bash
   cd autocomplete-amanc-main
   ```
3. Install the necessary dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables (see **Environment Variables** section below).
5. Start the application:
   ```bash
   npm start
   ```
6. Open your browser and navigate to `http://localhost:3000`.

### **Expose Local Server with ngrok (optional)**

If you need to make your local server accessible over the internet (for testing, demos, etc.), you can use **ngrok**. Here's how:

1. Install ngrok (if not already installed) from [ngrok.com](https://ngrok.com/).
2. Start your local application (`npm start`).
3. In a new terminal, run the following command to expose port 3000:
   ```bash
   ngrok http 3000
   ```
4. You will get a forwarding URL (e.g., `https://random-id.ngrok.io`). Use this URL to access your local app from anywhere.

## **Environment Variables**

In your project, create a `.env` file in the root directory. Below is a list of environment variables that need to be configured:

### **Required Variables**:

1. **`OPENAI_API_KEY`**: Your OpenAI API key for processing document analysis.

   ```bash
   OPENAI_API_KEY=your-openai-api-key-here
   ```

### **Example `.env` File**:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

### **Note**:

In production environments, services like Railway typically set the `PORT` environment variable automatically, so you don't need to define it manually for deployment. This ensures the app will bind to the dynamically assigned port.

## **Usage**

1. **Login**: Navigate to the login page and authenticate using the default credentials (`admin` / `admin`).
2. **Access the Form**: Once logged in, you will be redirected to the form page where you can upload an image and auto-fill the registration form.
3. **Upload a Document**: Use the form to upload a document image. The system will analyze the image and extract relevant data (e.g., name, birthdate, address).
4. **Submit the Form**: After auto-filling, verify the information and submit the form.
5. **Confirmation**: After form submission, a confirmation page will appear to indicate that the form was successfully sent. From this page, you can choose to submit another form or log out.
6. **Logout**: Users can log out from the form or confirmation pages.

## **Technologies Used**

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Document Processing**: External API (e.g., OCR for image analysis)
- **Session Management**: `express-session` for login and authentication
- **Database**: (Planned integration - MongoDB/MySQL/PostgreSQL)
- **QR Code Library**: (Planned for QR generation)

## **Future Enhancements**

- **QR Code Generation**: Automatically generate and print QR codes for digital document linking.
- **Database Integration**: Store extracted data in a structured database for easy access and management.
- **User Roles**: Implement role-based access for volunteers, admins, etc.
- **Security Enhancements**: Secure sensitive data using encryption.
- **OAuth Login**: Add support for OAuth login using popular providers like Google, Facebook, etc.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
