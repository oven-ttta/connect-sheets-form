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
    // console.log('Submitting to Google Sheets:', data);
    
    const response = await fetch('http://192.168.1.237:3001/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessNetwork: data.networkName,
        businessName: data.businessName,
        businessType: data.businessType,
        businessSize: data.businessSize,
        businessDescription: data.businessDescription,
        businessWebsite: data.businessWebsite,
        businessPhone: data.businessPhone,
        businessEmail: data.businessEmail,
        agricultureBusinessTypes: data.agricultureBusinessTypes.split(', '),
        painPoints: data.painPoints,
        groupBenefits: data.groupBenefits.split(', '),
        otherGroupBenefits: data.otherGroupBenefits,
        interestedActivities: data.interestedActivities.split(', '),
        workingTeamInterest: data.workingTeamInterest,
        expectations: data.expectations.split(', '),
        otherExpectations: data.otherExpectations,
        internationalMarkets: data.internationalMarkets.split(', '),
        otherInternationalMarkets: data.otherInternationalMarkets,
        termsAccepted: data.termsAccepted,
        dataProcessingConsent: data.dataProcessingConsent
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit to Google Sheets');
    }
    
    const result = await response.json();
    // console.log('Success:', result.message);
    
    return true;
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
