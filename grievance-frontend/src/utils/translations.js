const translations = {
  en: {
    // Navigation & Common
    nav: {
      dashboard: 'Dashboard',
      complaints: 'Complaints',
      createComplaint: 'Raise Complaint',
      officers: 'Officers',
      analytics: 'Analytics',
      performance: 'Performance',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      publicStats: 'Transparency',
      language: 'Language'
    },
    // Landing Page
    landing: {
      title: 'Time-Bound Grievance Resolution & Accountability System',
      subtitle: 'A transparent platform for citizens to report issues and track resolutions with guaranteed SLA timelines.',
      getStarted: 'Get Started',
      features: 'Core Features',
      stats: 'System Impact'
    },
    // Dashboards
    dashboard: {
      welcome: 'Welcome back',
      totalComplaints: 'Total Complaints',
      pending: 'Pending',
      resolved: 'Resolved',
      escalated: 'Escalated',
      recentComplaints: 'Recent Complaints',
      viewAll: 'View All'
    },
    // Complaint Form
    form: {
      title: 'Title',
      description: 'Description',
      category: 'Category',
      location: 'Location',
      severity: 'Severity',
      submit: 'Submit Complaint',
      cancel: 'Cancel',
      uploadImage: 'Upload Photographic Evidence'
    },
    // Severity Levels
    severity: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    },
    // Status
    status: {
      open: 'Open',
      verified: 'Verified',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      escalated: 'Escalated',
      closed: 'Closed'
    },
    // Complaint Details
    details: {
      history: 'Resolution History',
      description: 'Description',
      location: 'Location',
      filedOn: 'Filed On',
      assignedOfficer: 'Assigned Officer',
      slaDeadline: 'SLA Deadline',
      evidence: 'Photographic Evidence',
      supportedBy: 'Supported by',
      citizens: 'citizens',
      backToDashboard: 'Back to Dashboard',
      notFound: 'Complaint Not Found'
    },
    // Performance
    performance: {
      metrics: 'Performance Metrics',
      subtitle: 'Review your resolution rates and task distribution.',
      totalAssigned: 'Total Assigned',
      distribution: 'Status Distribution',
      rate: 'Resolution Rate',
      escalationRate: 'Escalation Rate',
      percentageDesc: 'Percentage of assigned issues successfully resolved',
      tasksDelayed: 'Tasks delayed past SLA'
    },
    // Auth
    auth: {
      welcome: 'Welcome back',
      signIn: 'Sign in to access your dashboard',
      email: 'Email address',
      password: 'Password',
      signInBtn: 'Sign in',
      signingIn: 'Signing in...',
      notMember: 'Not a member?',
      registerNow: 'Register now',
      createAccount: 'Create Account',
      joinPlatform: 'Join the Grievance System platform',
      fullName: 'Full Name',
      role: 'Role',
      department: 'Department',
      confirmPassword: 'Confirm',
      registerBtn: 'Register',
      registering: 'Creating Account...',
      alreadyAccount: 'Already have an account?',
      loginHere: 'Login here',
      loginSuccess: 'Login successful!',
      registerSuccess: 'Account created successfully!'
    },
    // Admin
    admin: {
      analyticsTitle: 'System Analytics',
      analyticsSubtitle: 'Detailed breakdown of grievance statistics and system usage.',
      totalUsers: 'Total Users',
      statusDistribution: 'Complaint Status Distribution',
      execSummary: 'Executive Summary',
      avgResolutionTime: 'Avg Resolution Time',
      totalOfficers: 'Total Officers',
      activeCitizens: 'Active Citizens',
      officersTitle: 'Officers Management',
      officersSubtitle: 'Add, update, and manage official personnel.',
      addOfficer: 'Add Officer',
      name: 'Name',
      email: 'Email',
      levelStatus: 'Level & Status',
      active: 'Active',
      inactive: 'Inactive',
      addModalTitle: 'Add New Officer',
      authorityLevel: 'Authority Level',
      tempPassword: 'Temporary Password'
    },
    // Notifications
    notifications: {
      title: 'Notifications',
      empty: 'No new notifications',
      markAllRead: 'Mark all as read',
      markRead: 'Mark as read',
      viewAll: 'View all',
      new: 'New'
    },
    // Categories
    categories: {
      'Water Supply': 'Water Supply',
      'Sanitation': 'Sanitation',
      'Roads & Infrastructure': 'Roads & Infrastructure',
      'Public Health': 'Public Health',
      'Education': 'Education',
      'Police': 'Police',
      'Electricity': 'Electricity',
      'Parks & Recreation': 'Parks & Recreation',
      'Transportation': 'Transportation',
      'Other': 'Other'
    }
  },
  ta: {
    // Navigation & Common
    nav: {
      dashboard: 'டாஷ்போர்டு',
      complaints: 'புகார்கள்',
      createComplaint: 'புகார் பதிவு செய்ய',
      officers: 'அதிகாரிகள்',
      analytics: 'புள்ளிவிவரங்கள்',
      performance: 'செயல்திறன்',
      logout: 'வெளியேறு',
      login: 'உள்நுழை',
      register: 'பதிவு செய்',
      publicStats: 'வெளிப்படைத்தன்மை',
      language: 'மொழி'
    },
    // Landing Page
    landing: {
      title: 'காலவரையறைக்குட்பட்ட குறைதீர்ப்பு மற்றும் பொறுப்புக்கூறல் அமைப்பு',
      subtitle: 'குடிமக்கள் பிரச்சனைகளைப் புகாரளிக்கவும், உத்திரவாதமளிக்கப்பட்ட SLA காலக்கெடுவுடன் தீர்வுகளைக் கண்காணிக்கவும் ஒரு வெளிப்படையான தளம்.',
      getStarted: 'தொடங்குங்கள்',
      features: 'முக்கிய அம்சங்கள்',
      stats: 'அமைப்பின் தாக்கம்'
    },
    // Dashboards
    dashboard: {
      welcome: 'மீண்டும் வருக',
      totalComplaints: 'மொத்த புகார்கள்',
      pending: 'நிலுவையில் உள்ளவை',
      resolved: 'தீர்வு காணப்பட்டவை',
      escalated: 'மேல்முறையீடு செய்யப்பட்டவை',
      recentComplaints: 'சமீபத்திய புகார்கள்',
      viewAll: 'அனைத்தையும் பார்க்க'
    },
    // Complaint Form
    form: {
      title: 'தலைப்பு',
      description: 'விளக்கம்',
      category: 'வகை',
      location: 'இருப்பிடம்',
      severity: 'தீவிரம்',
      submit: 'புகாரைச் சமர்ப்பிக்கவும்',
      cancel: 'ரத்து செய்',
      uploadImage: 'புகைப்பட ஆதாரத்தைப் பதிவேற்றவும்'
    },
    // Severity Levels
    severity: {
      low: 'குறைந்த',
      medium: 'நடுத்தர',
      high: 'அதிக',
      critical: 'மிகவும் அவசரமான'
    },
    // Status
    status: {
      open: 'திறக்கப்பட்டது',
      verified: 'சரிபார்க்கப்பட்டது',
      inProgress: 'செயல்பாட்டில் உள்ளது',
      resolved: 'தீர்வு காணப்பட்டது',
      escalated: 'மேல்முறையீடு செய்யப்பட்டது',
      closed: 'மூடப்பட்டது'
    },
    // Complaint Details
    details: {
      history: 'தீர்வு வரலாறு',
      description: 'விளக்கம்',
      location: 'இருப்பிடம்',
      filedOn: 'பதிவு செய்யப்பட்டது',
      assignedOfficer: 'ஒதுக்கப்பட்ட அதிகாரி',
      slaDeadline: 'SLA காலக்கெடு',
      evidence: 'புகைப்பட சான்று',
      supportedBy: 'ஆதரவு அளித்தவர்கள்',
      citizens: 'குடிமக்கள்',
      backToDashboard: 'டாஷ்போர்டுக்கு திரும்பவும்',
      notFound: 'புகார் காணப்படவில்லை'
    },
    // Performance
    performance: {
      metrics: 'செயல்திறன் அளவீடுகள்',
      subtitle: 'உங்கள் தீர்வு விகிதங்கள் மற்றும் பணி ஒதுக்கீட்டை மதிப்பாய்வு செய்யவும்.',
      totalAssigned: 'மொத்தம் ஒதுக்கப்பட்டவை',
      distribution: 'நிலை விநியோகம்',
      rate: 'தீர்வு விகிதம்',
      escalationRate: 'மேல்முறையீட்டு விகிதம்',
      percentageDesc: 'வெற்றிகரமாக தீர்க்கப்பட்ட ஒதுக்கப்பட்ட சிக்கல்களின் சதவீதம்',
      tasksDelayed: 'SLA தாண்டி தாமதமான பணிகள்'
    },
    // Auth
    auth: {
      welcome: 'மீண்டும் வருக',
      signIn: 'உங்கள் டாஷ்போர்டை அணுக உள்நுழையவும்',
      email: 'மின்னஞ்சல் முகவரி',
      password: 'கடவுச்சொல்',
      signInBtn: 'உள்நுழை',
      signingIn: 'உள்நுழைகிறது...',
      notMember: 'உறுப்பினராக இல்லையா?',
      registerNow: 'இப்போது பதிவு செய்யவும்',
      createAccount: 'கணக்கை உருவாக்கவும்',
      joinPlatform: 'குறை தீர்க்கும் அமைப்பு தளத்தில் இணையுங்கள்',
      fullName: 'முழு பெயர்',
      role: 'பங்கு',
      department: 'துறை',
      confirmPassword: 'உறுதிப்படுத்தவும்',
      registerBtn: 'பதிவு செய்யவும்',
      registering: 'கணக்கை உருவாக்குகிறது...',
      alreadyAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
      loginHere: 'இங்கே உள்நுழையவும்',
      loginSuccess: 'உள்நுழைவு வெற்றிகரமாக முடிந்தது!',
      registerSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!'
    },
    // Admin
    admin: {
      analyticsTitle: 'அமைப்பின் பகுப்பாய்வு',
      analyticsSubtitle: 'புகார் புள்ளிவிவரங்கள் மற்றும் கணினி பயன்பாட்டின் விரிவான முறிவு.',
      totalUsers: 'மொத்த பயனர்கள்',
      statusDistribution: 'புகார் நிலை விநியோகம்',
      execSummary: 'நிர்வாகச் சுருக்கம்',
      avgResolutionTime: 'சராசரி தீர்வு நேரம்',
      totalOfficers: 'மொத்த அதிகாரிகள்',
      activeCitizens: 'செயலில் உள்ள குடிமக்கள்',
      officersTitle: 'அதிகாரிகள் மேலாண்மை',
      officersSubtitle: 'அதிகாரப்பூர்வ பணியாளர்களைச் சேர்க்கவும், புதுப்பிக்கவும் மற்றும் நிர்வகிக்கவும்.',
      addOfficer: 'அதிகாரியைச் சேர்க்கவும்',
      name: 'பெயர்',
      email: 'மின்னஞ்சல்',
      levelStatus: 'நிலை மற்றும் நிலை',
      active: 'செயலில்',
      inactive: 'செயலற்றது',
      addModalTitle: 'புதிய அதிகாரியைச் சேர்க்கவும்',
      authorityLevel: 'அதிகார நிலை',
      tempPassword: 'தற்காலிக கடவுச்சொல்'
    },
    // Notifications
    notifications: {
      title: 'அறிவிப்புகள்',
      empty: 'புதிய அறிவிப்புகள் எதுவும் இல்லை',
      markAllRead: 'அனைத்தையும் படித்ததாகக் குறிக்கவும்',
      markRead: 'படித்ததாகக் குறிக்கவும்',
      viewAll: 'அனைத்தையும் பார்க்க',
      new: 'புதிய'
    },
    // Categories
    categories: {
      'Water Supply': 'குடிநீர் வழங்கல்',
      'Sanitation': 'சுகாதாரம்',
      'Roads & Infrastructure': 'சாலைகள் மற்றும் உள்கட்டமைப்பு',
      'Public Health': 'பொது சுகாதாரம்',
      'Education': 'கல்வி',
      'Police': 'காவல்துறை',
      'Electricity': 'மின்சாரம்',
      'Parks & Recreation': 'பூங்காக்கள் மற்றும் பொழுதுபோக்கு',
      'Transportation': 'போக்குவரத்து',
      'Other': 'மற்றவை'
    }
  }
};

export default translations;
