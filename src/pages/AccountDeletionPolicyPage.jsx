import React from 'react';

const AccountDeletionPolicyPage = () => {
    const style = `
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2 {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .container {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
        }
    `;

    return (
        <>
            <style>{style}</style>
            <div className="container">
                <h1>Account Deletion for the Seattle Info Mobile App</h1>
                <p>This page explains how you can request the deletion of your account and associated data for the Seattle Info Mobile app.</p>

                <h2>How to Request Account Deletion</h2>
                <p>You can delete your account directly from within the Seattle Info Mobile application by following these steps:</p>
                <ol>
                    <li>Log in to your account in the app.</li>
                    <li>Navigate to the <strong>"Profile"</strong> or <strong>"Settings"</strong> section.</li>
                    <li>Tap on the <strong>"Delete Account"</strong> option.</li>
                    <li>Follow the on-screen prompts to confirm the deletion. This action is irreversible.</li>
                </ol>

                <h2>Alternative Deletion Method</h2>
                <p>If you are unable to access the app, you can request account deletion by sending an email to our support team at <a href="mailto:your-support-email@example.com"><strong>your-support-email@example.com</strong></a>. Please include your username or the email address associated with your account to help us identify it.</p>

                <h2>Data Deletion and Retention</h2>
                <p>Upon receiving a deletion request through the app or via email, we will permanently delete your account and associated personal data. Here’s what that includes:</p>
                <ul>
                    <li><strong>What is deleted:</strong>
                        <ul>
                            <li>Your primary account credentials (e.g., email, username, and authentication provider details).</li>
                            <li>Your user profile information (e.g., name, profile picture).</li>
                            <li>Any user-generated content you have created that is tied to your account.</li>
                        </ul>
                    </li>
                    <li><strong>What may be retained:</strong>
                        <ul>
                            <li>We may retain certain data for a limited period (typically up to 90 days) for legitimate business purposes, such as security, fraud prevention, or to comply with legal obligations.</li>
                            <li>Any data that has been fully anonymized and cannot be linked back to you may be kept for statistical or analytical purposes.</li>
                        </ul>
                    </li>
                </ul>
                <p>The deletion process will begin immediately after your request is confirmed and will be completed within a reasonable timeframe.</p>
            </div>
        </>
    );
};

export default AccountDeletionPolicyPage;
