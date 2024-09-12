# **Datamatic - Automating Document Management for AMANC**

**Datamatic** is a document digitalization and automation solution designed to streamline the registration and data entry process at AMANC (or similar organizations). The application allows users to upload physical documents, which are then analyzed and converted into digital data automatically, saving time and improving data accuracy.

## **Table of Contents**

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## **Problem Statement**

AMANC and similar organizations often deal with a large number of documents and patient registrations. The lack of a fully digital and automated system results in inefficiencies, loss of time, and potential errors in data entry.

The current system relies heavily on manual data entry using Excel sheets, which complicates real-time updates and personalized service.

## **Features**

- **Image Upload and Analysis**: Upload an image of a document, and the system will automatically extract relevant data, reducing the need for manual entry.
- **Form Autofill**: After analyzing a document, the extracted data is used to populate the registration form automatically.
- **Real-time Updates**: When any data is modified, it will update across the entire database in real-time.
- **QR Code Integration (Planned)**: Generate QR codes for physical documents, linking them to their digital records for easy access and retrieval.

## **Installation**

To set up this project locally, follow these steps:

### **Prerequisites**

- Node.js (v14 or above)
- Git

### **Steps**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd autocomplete-amanc-main
   ```
3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

### **Expose Local Server with ngrok**

If you need to make your local server accessible over the internet (for testing, demos, etc.), you can use **ngrok**. Here's how:

1. Install ngrok (if not already installed) from [ngrok.com](https://ngrok.com/).
2. Start your local application (`npm start`).
3. In a new terminal, run the following command to expose port 3000:
   ```bash
   ngrok http 3000
   ```
4. You will get a forwarding URL (e.g., `https://random-id.ngrok.io`). Use this URL to access your local app from anywhere.

## **Usage**

1. Open the application in your browser.
2. Upload a document image through the form.
3. The application will analyze the image, extract relevant data (e.g., name, birthdate, address), and auto-populate the registration form.
4. Submit the form to store the data in the system.

## **Technologies Used**

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Document Processing**: External API (e.g., OCR for image analysis)
- **Database**: (Planned integration - MongoDB/MySQL/PostgreSQL)
- **QR Code Library**: (Planned for QR generation)

## **Future Enhancements**

- **QR Code Generation**: Automatically generate and print QR codes for digital document linking.
- **Database Integration**: Store extracted data in a structured database for easy access and management.
- **User Roles**: Implement user authentication and role-based access for volunteers, admins, etc.
- **Security Enhancements**: Secure sensitive data using encryption.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
