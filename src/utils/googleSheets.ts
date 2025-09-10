// Google Sheets Integration Utility
// This file contains functions to submit form data to Google Sheets

export interface FormSubmissionData {
  timestamp: string;
  networkName: string;
  businessName: string;
  businessType: string;
  businessSize: string;
  businessDescription: string;
  businessWebsite: string;
  businessPhone: string;
  businessEmail: string;
  agricultureBusinessTypes: string;
  painPoints: string;
  groupBenefits: string;
  otherGroupBenefits: string;
  interestedActivities: string;
  workingTeamInterest: string;
  expectations: string;
  otherExpectations: string;
  internationalMarkets: string;
  otherInternationalMarkets: string;
  termsAccepted: boolean;
  dataProcessingConsent: boolean;
}

// Google Sheets API endpoint (you would replace this with your actual endpoint)
const GOOGLE_SHEETS_ENDPOINT = '';

export const submitToGoogleSheets = async (data: FormSubmissionData): Promise<boolean> => {
  try {
    // In a real implementation, you would:
    // 1. Send the data to your backend API
    // 2. Your backend would use Google Sheets API to append the data
    // 3. Return success/failure status
    
    // For now, we'll simulate the API call
    console.log('Submitting to Google Sheets:', data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, replace this with actual API call:
    /*
    const response = await fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit to Google Sheets');
    }
    
    return true;
    */
    
    return true; // Simulate success
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return false;
  }
};

// Helper function to format data for Google Sheets
export const formatDataForSheets = (data: FormSubmissionData): string[] => {
  return [
    data.timestamp,
    data.networkName,
    data.businessName,
    data.businessType,
    data.businessSize,
    data.businessDescription,
    data.businessWebsite,
    data.businessPhone,
    data.businessEmail,
    data.agricultureBusinessTypes,
    data.painPoints,
    data.groupBenefits,
    data.otherGroupBenefits,
    data.interestedActivities,
    data.workingTeamInterest,
    data.expectations,
    data.otherExpectations,
    data.internationalMarkets,
    data.otherInternationalMarkets,
    data.termsAccepted ? 'Yes' : 'No',
    data.dataProcessingConsent ? 'Yes' : 'No'
  ];
};

// Google Sheets column headers
export const SHEET_HEADERS = [
  'Timestamp',
  'Network Name',
  'Business Name',
  'Business Type',
  'Business Size',
  'Business Description',
  'Business Website',
  'Business Phone',
  'Business Email',
  'Agriculture Business Types',
  'Pain Points',
  'Group Benefits',
  'Other Group Benefits',
  'Interested Activities',
  'Working Team Interest',
  'Expectations',
  'Other Expectations',
  'International Markets',
  'Other International Markets',
  'Terms Accepted',
  'Data Processing Consent'
];
