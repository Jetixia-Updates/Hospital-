// Role-Based Access Control (RBAC) Configuration
// نظام التحكم بالصلاحيات حسب الأدوار

export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'export')[];
}

export interface RolePermissions {
  role: string;
  nameAr: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  // مدير النظام - Full Access
  ADMIN: {
    role: 'ADMIN',
    nameAr: 'مدير النظام',
    description: 'Full system access - all modules',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'roles', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'permissions', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'departments', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'clinics', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'patients', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'medical-records', actions: ['read', 'delete'] },
      { module: 'billing', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { module: 'insurance', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'pharmacy', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'reports', actions: ['read', 'export'] },
      { module: 'settings', actions: ['read', 'update'] },
      { module: 'audit-logs', actions: ['read', 'export'] },
    ],
  },

  // مدير المستشفى
  MANAGER: {
    role: 'MANAGER',
    nameAr: 'مدير المستشفى',
    description: 'Hospital management and operations',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update'] },
      { module: 'departments', actions: ['create', 'read', 'update'] },
      { module: 'clinics', actions: ['create', 'read', 'update'] },
      { module: 'appointments', actions: ['read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['read'] },
      { module: 'billing', actions: ['read', 'approve'] },
      { module: 'insurance', actions: ['read', 'approve'] },
      { module: 'pharmacy', actions: ['read'] },
      { module: 'inventory', actions: ['read', 'approve'] },
      { module: 'equipment', actions: ['create', 'read', 'update'] },
      { module: 'shifts', actions: ['create', 'read', 'update'] },
      { module: 'reports', actions: ['read', 'export'] },
      { module: 'audit-logs', actions: ['read'] },
    ],
  },

  // طبيب
  DOCTOR: {
    role: 'DOCTOR',
    nameAr: 'طبيب',
    description: 'Medical care and patient treatment',
    permissions: [
      { module: 'appointments', actions: ['read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['create', 'read', 'update'] },
      { module: 'prescriptions', actions: ['create', 'read', 'update'] },
      { module: 'lab-tests', actions: ['create', 'read'] },
      { module: 'imaging-studies', actions: ['create', 'read'] },
      { module: 'vital-signs', actions: ['create', 'read'] },
      { module: 'allergies', actions: ['create', 'read', 'update'] },
      { module: 'vaccinations', actions: ['create', 'read'] },
      { module: 'admissions', actions: ['create', 'read', 'update'] },
      { module: 'surgeries', actions: ['create', 'read', 'update'] },
      { module: 'emergency', actions: ['create', 'read', 'update'] },
      { module: 'billing', actions: ['read'] },
      { module: 'reports', actions: ['read', 'export'] },
    ],
  },

  // ممرض/ممرضة
  NURSE: {
    role: 'NURSE',
    nameAr: 'ممرض/ممرضة',
    description: 'Patient care and vital signs monitoring',
    permissions: [
      { module: 'appointments', actions: ['read'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['read'] },
      { module: 'prescriptions', actions: ['read'] },
      { module: 'vital-signs', actions: ['create', 'read', 'update'] },
      { module: 'lab-tests', actions: ['read'] },
      { module: 'imaging-studies', actions: ['read'] },
      { module: 'admissions', actions: ['read', 'update'] },
      { module: 'emergency', actions: ['create', 'read', 'update'] },
      { module: 'vaccinations', actions: ['create', 'read'] },
      { module: 'shifts', actions: ['read'] },
    ],
  },

  // موظف استقبال
  RECEPTIONIST: {
    role: 'RECEPTIONIST',
    nameAr: 'موظف استقبال',
    description: 'Patient registration and appointment scheduling',
    permissions: [
      { module: 'appointments', actions: ['create', 'read', 'update'] },
      { module: 'patients', actions: ['create', 'read', 'update'] },
      { module: 'insurance', actions: ['create', 'read'] },
      { module: 'billing', actions: ['create', 'read'] },
      { module: 'emergency', actions: ['create', 'read'] },
      { module: 'clinics', actions: ['read'] },
      { module: 'departments', actions: ['read'] },
    ],
  },

  // فني مختبر
  LAB_TECH: {
    role: 'LAB_TECH',
    nameAr: 'فني مختبر',
    description: 'Laboratory tests and results',
    permissions: [
      { module: 'lab-tests', actions: ['create', 'read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['read'] },
      { module: 'reports', actions: ['read', 'export'] },
      { module: 'shifts', actions: ['read'] },
    ],
  },

  // صيدلي
  PHARMACIST: {
    role: 'PHARMACIST',
    nameAr: 'صيدلي',
    description: 'Medication dispensing and pharmacy management',
    permissions: [
      { module: 'prescriptions', actions: ['read', 'update'] },
      { module: 'pharmacy', actions: ['create', 'read', 'update'] },
      { module: 'medicines', actions: ['create', 'read', 'update'] },
      { module: 'inventory', actions: ['read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'billing', actions: ['create', 'read'] },
      { module: 'reports', actions: ['read', 'export'] },
      { module: 'shifts', actions: ['read'] },
    ],
  },

  // أخصائي أشعة
  RADIOLOGIST: {
    role: 'RADIOLOGIST',
    nameAr: 'أخصائي أشعة',
    description: 'Imaging studies and radiology',
    permissions: [
      { module: 'imaging-studies', actions: ['create', 'read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['read'] },
      { module: 'reports', actions: ['read', 'export'] },
      { module: 'shifts', actions: ['read'] },
    ],
  },

  // جراح
  SURGEON: {
    role: 'SURGEON',
    nameAr: 'جراح',
    description: 'Surgical procedures and operations',
    permissions: [
      { module: 'appointments', actions: ['read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['create', 'read', 'update'] },
      { module: 'surgeries', actions: ['create', 'read', 'update'] },
      { module: 'prescriptions', actions: ['create', 'read', 'update'] },
      { module: 'lab-tests', actions: ['create', 'read'] },
      { module: 'imaging-studies', actions: ['create', 'read'] },
      { module: 'admissions', actions: ['create', 'read', 'update'] },
      { module: 'reports', actions: ['read', 'export'] },
    ],
  },

  // طبيب تخدير
  ANESTHESIOLOGIST: {
    role: 'ANESTHESIOLOGIST',
    nameAr: 'طبيب تخدير',
    description: 'Anesthesia and perioperative care',
    permissions: [
      { module: 'surgeries', actions: ['read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['create', 'read', 'update'] },
      { module: 'vital-signs', actions: ['create', 'read'] },
      { module: 'allergies', actions: ['read'] },
      { module: 'reports', actions: ['read'] },
    ],
  },

  // أخصائي تغذية
  NUTRITIONIST: {
    role: 'NUTRITIONIST',
    nameAr: 'أخصائي تغذية',
    description: 'Dietary planning and nutrition consultation',
    permissions: [
      { module: 'appointments', actions: ['read'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['create', 'read', 'update'] },
      { module: 'vital-signs', actions: ['read'] },
      { module: 'reports', actions: ['read', 'export'] },
    ],
  },

  // أخصائي علاج طبيعي
  PHYSIOTHERAPIST: {
    role: 'PHYSIOTHERAPIST',
    nameAr: 'أخصائي علاج طبيعي',
    description: 'Physical therapy and rehabilitation',
    permissions: [
      { module: 'appointments', actions: ['read'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['create', 'read', 'update'] },
      { module: 'reports', actions: ['read', 'export'] },
    ],
  },

  // أخصائي نفسي
  PSYCHOLOGIST: {
    role: 'PSYCHOLOGIST',
    nameAr: 'أخصائي نفسي',
    description: 'Mental health and psychological services',
    permissions: [
      { module: 'appointments', actions: ['read', 'update'] },
      { module: 'patients', actions: ['read'] },
      { module: 'medical-records', actions: ['create', 'read', 'update'] },
      { module: 'prescriptions', actions: ['create', 'read'] },
      { module: 'reports', actions: ['read', 'export'] },
    ],
  },

  // محاسب
  ACCOUNTANT: {
    role: 'ACCOUNTANT',
    nameAr: 'محاسب',
    description: 'Financial management and billing',
    permissions: [
      { module: 'billing', actions: ['create', 'read', 'update', 'approve'] },
      { module: 'insurance', actions: ['read', 'update'] },
      { module: 'pharmacy', actions: ['read'] },
      { module: 'inventory', actions: ['read'] },
      { module: 'purchase-orders', actions: ['create', 'read', 'approve'] },
      { module: 'suppliers', actions: ['create', 'read', 'update'] },
      { module: 'reports', actions: ['read', 'export'] },
      { module: 'patients', actions: ['read'] },
    ],
  },

  // دعم فني
  IT_SUPPORT: {
    role: 'IT_SUPPORT',
    nameAr: 'دعم فني',
    description: 'Technical support and system maintenance',
    permissions: [
      { module: 'users', actions: ['read', 'update'] },
      { module: 'settings', actions: ['read', 'update'] },
      { module: 'audit-logs', actions: ['read', 'export'] },
      { module: 'equipment', actions: ['read', 'update'] },
    ],
  },

  // أمن
  SECURITY: {
    role: 'SECURITY',
    nameAr: 'أمن',
    description: 'Security and access control',
    permissions: [
      { module: 'emergency', actions: ['read'] },
      { module: 'visitors', actions: ['create', 'read'] },
      { module: 'audit-logs', actions: ['read'] },
    ],
  },

  // عامل نظافة
  CLEANER: {
    role: 'CLEANER',
    nameAr: 'عامل نظافة',
    description: 'Housekeeping and sanitation',
    permissions: [
      { module: 'shifts', actions: ['read'] },
      { module: 'rooms', actions: ['read', 'update'] },
    ],
  },

  // مريض
  PATIENT: {
    role: 'PATIENT',
    nameAr: 'مريض',
    description: 'Patient portal access',
    permissions: [
      { module: 'appointments', actions: ['create', 'read'] },
      { module: 'medical-records', actions: ['read'] },
      { module: 'prescriptions', actions: ['read'] },
      { module: 'lab-tests', actions: ['read'] },
      { module: 'imaging-studies', actions: ['read'] },
      { module: 'billing', actions: ['read'] },
      { module: 'insurance', actions: ['read'] },
      { module: 'profile', actions: ['read', 'update'] },
    ],
  },
};

// Helper function to check if user has permission
export function hasPermission(
  userRole: string,
  module: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export'
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const modulePermission = rolePermissions.permissions.find(p => p.module === module);
  if (!modulePermission) return false;

  return modulePermission.actions.includes(action);
}

// Get all modules accessible by role
export function getAccessibleModules(userRole: string): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return [];

  return rolePermissions.permissions.map(p => p.module);
}

// Get all actions allowed for a module
export function getAllowedActions(userRole: string, module: string): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return [];

  const modulePermission = rolePermissions.permissions.find(p => p.module === module);
  return modulePermission?.actions || [];
}
