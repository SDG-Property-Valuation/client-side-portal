export const reports = [
  {
    id: 'VR-2024-001',
    title: 'Lakeside Residency',
    titleMr: 'लेकसाइड रेसिडेन्सी',
    address: '2047 Lake View Dr, Austin, TX',
    requestedBy: 'Harborview Bank',
    clientType: 'Bank',
    status: 'Completed',
    estimatedValue: '1.82 Cr',
    issuedOn: 'Aug 24, 2024',
    issuedOnMr: 'Aug 24, 2024',
    updatedOn: 'Sep 2, 2024',
    summary:
      'Full appraisal completed with interior inspection and market comparable review.',
    summaryMr:
      'आतील तपासणी आणि बाजारातील तुलनात्मक विक्रीच्या पुनरावलोकनासह संपूर्ण मूल्यांकन पूर्ण झाले.',
    method: 'Sales comparison + income approach',
    methodMr: 'विक्री तुलना + उत्पन्न पद्धत',
    riskLevel: 'Low',
    contacts: ['Maya Patel', 'Loan Officer'],
    highlights: [
      'Comparable sales within 1.2 miles, last 6 months.',
      'Renovated kitchen and upgraded HVAC in 2023.',
      'Zoning verified, no outstanding compliance issues.',
    ],
    highlightsMr: [
      '१.२ मैलांच्या आत मागील ६ महिन्यांतील तुलनात्मक विक्री.',
      '२०२३ मध्ये स्वयंपाकघर नूतनीकरण आणि HVAC अपग्रेड.',
      'झोनिंग पडताळले, कोणतेही प्रलंबित अनुपालन मुद्दे नाहीत.',
    ],
  },
  {
    id: 'VR-2024-002',
    title: 'Harborfront Commercial Plaza',
    titleMr: 'हार्बरफ्रंट कमर्शियल प्लाझा',
    address: '18 Harbor Way, Miami, FL',
    requestedBy: 'Coastal Capital',
    clientType: 'Bank',
    status: 'In Review',
    estimatedValue: '6.45 Cr',
    issuedOn: 'Pending',
    issuedOnMr: 'प्रलंबित',
    updatedOn: 'Sep 4, 2024',
    summary:
      'Field inspection completed. Awaiting lease abstracts and tenancy verification.',
    summaryMr:
      'मैदानी तपासणी पूर्ण. लीज अब्स्ट्रॅक्ट्स आणि भाडेकरू पडताळणीची प्रतीक्षा.',
    method: 'Income capitalization',
    methodMr: 'उत्पन्न भांडवलीकरण',
    riskLevel: 'Medium',
    contacts: ['Luis Romero', 'Credit Analyst'],
    highlights: [
      'Occupancy at 88% with two anchor tenants.',
      'Lease rollover risk in Q1 next year.',
      'Parking ratio below market average.',
    ],
    highlightsMr: [
      'दोन अँकर भाडेकरूंनी ८८% भरलेली जागा.',
      'पुढील वर्षाच्या Q1 मध्ये लीज रोलओव्हरचा धोका.',
      'पार्किंग प्रमाण बाजार सरासरीपेक्षा कमी.',
    ],
  },
  {
    id: 'VR-2024-003',
    title: 'Cedar Point Estate',
    titleMr: 'सीडर पॉईंट इस्टेट',
    address: '77 Ridgecrest Ln, Denver, CO',
    requestedBy: 'Personal Client',
    clientType: 'Personal',
    status: 'Draft',
    estimatedValue: '94 L',
    issuedOn: 'Pending',
    issuedOnMr: 'प्रलंबित',
    updatedOn: 'Sep 6, 2024',
    summary:
      'Site visit scheduled. Client has provided preliminary registry documents.',
    summaryMr:
      'साईट व्हिजिट शेड्युल केले आहे. क्लायंटने प्राथमिक नोंदणी कागदपत्रे दिली आहेत.',
    method: 'Sales comparison',
    methodMr: 'विक्री तुलना',
    riskLevel: 'Low',
    contacts: ['Erin Jacobs', 'Owner'],
    highlights: [
      'Preliminary valuation based on exterior inspection.',
      'Awaiting interior access confirmation.',
      'Land parcel survey to be submitted.',
    ],
    highlightsMr: [
      'बाह्य तपासणीवर आधारित प्राथमिक मूल्यांकन.',
      'आतील प्रवेश पुष्टीची प्रतीक्षा.',
      'जमीन सर्वेक्षण सादर करायचे आहे.',
    ],
  },
]

export const getReportById = (reportId) =>
  reports.find((report) => report.id === reportId)
