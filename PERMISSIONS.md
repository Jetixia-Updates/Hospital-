# Role Permissions Documentation | توثيق صلاحيات الأدوار

<div dir="rtl">

## نظام الصلاحيات الشامل

هذا المستند يوضح جميع الصلاحيات لكل دور في النظام. كل دور له صلاحيات محددة على الوحدات (Modules) مع إمكانيات معينة (Actions).

### الإمكانيات المتاحة:
- **Create** (إنشاء): إضافة سجلات جديدة
- **Read** (قراءة): عرض البيانات
- **Update** (تحديث): تعديل البيانات الموجودة
- **Delete** (حذف): حذف السجلات
- **Approve** (موافقة): الموافقة على الطلبات
- **Export** (تصدير): تصدير البيانات والتقارير

</div>

## Complete Role Permissions Matrix

### 1. ADMIN (مدير النظام)

**Full System Access - All Modules**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Users | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Roles & Permissions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Departments | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clinics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Appointments | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patients | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Medical Records | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Billing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Insurance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pharmacy | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Settings | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Audit Logs | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

### 2. MANAGER (مدير المستشفى)

**Hospital Management & Operations**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Users | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Departments | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Clinics | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Appointments | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Medical Records | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Billing | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Insurance | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Pharmacy | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Inventory | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Equipment | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Shifts | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Audit Logs | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 3. DOCTOR (طبيب)

**Medical Care & Patient Treatment**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Prescriptions | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Lab Tests | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Imaging Studies | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Vital Signs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Allergies | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Vaccinations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Admissions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Surgeries | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Emergency Cases | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Billing | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

### 4. NURSE (ممرض/ممرضة)

**Patient Care & Vital Signs Monitoring**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Prescriptions | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Vital Signs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Lab Tests | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Imaging Studies | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Admissions | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Emergency Cases | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Vaccinations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Shifts | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 5. RECEPTIONIST (موظف استقبال)

**Patient Registration & Appointment Scheduling**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Patients | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Insurance | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Billing | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Emergency Cases | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Clinics | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Departments | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 6. LAB_TECH (فني مختبر)

**Laboratory Tests & Results**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Lab Tests | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Shifts | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 7. PHARMACIST (صيدلي)

**Medication Dispensing & Pharmacy Management**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Prescriptions | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pharmacy | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Medicines | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Inventory | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Billing | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Shifts | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 8. RADIOLOGIST (أخصائي أشعة)

**Imaging Studies & Radiology**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Imaging Studies | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Shifts | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 9. SURGEON (جراح)

**Surgical Procedures & Operations**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Surgeries | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Prescriptions | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Lab Tests | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Imaging Studies | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Admissions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

### 10. ANESTHESIOLOGIST (طبيب تخدير)

**Anesthesia & Perioperative Care**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Surgeries | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Vital Signs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Allergies | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 11. NUTRITIONIST (أخصائي تغذية)

**Dietary Planning & Nutrition Consultation**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Vital Signs | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

### 12. PHYSIOTHERAPIST (أخصائي علاج طبيعي)

**Physical Therapy & Rehabilitation**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

### 13. PSYCHOLOGIST (أخصائي نفسي)

**Mental Health & Psychological Services**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Prescriptions | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

### 14. ACCOUNTANT (محاسب)

**Financial Management & Billing**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Billing | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Insurance | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Pharmacy | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Inventory | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Purchase Orders | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Suppliers | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Reports | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Patients | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 15. IT_SUPPORT (دعم فني)

**Technical Support & System Maintenance**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Users | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Settings | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Audit Logs | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Equipment | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

### 16. SECURITY (أمن)

**Security & Access Control**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Emergency Cases | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Visitors | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Audit Logs | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 17. CLEANER (عامل نظافة)

**Housekeeping & Sanitation**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Shifts | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Rooms | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

### 18. PATIENT (مريض)

**Patient Portal Access**

| Module | Create | Read | Update | Delete | Approve | Export |
|--------|--------|------|--------|--------|---------|--------|
| Appointments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Medical Records | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Prescriptions | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Lab Tests | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Imaging Studies | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Billing | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Insurance | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Profile | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

<div dir="rtl">

## ملاحظات مهمة:

1. **المرونة**: يمكن تخصيص الصلاحيات حسب احتياجات كل مستشفى
2. **الأمان**: جميع العمليات محفوظة في سجل التدقيق (Audit Log)
3. **البيانات الحساسة**: السجلات الطبية محمية ولا يمكن حذفها إلا من قبل المسؤول
4. **الصلاحيات المتقاطعة**: بعض الأدوار لها صلاحيات متشابهة للتعاون في العمل
5. **التطوير المستمر**: يمكن إضافة أدوار وصلاحيات جديدة حسب الحاجة

## استخدام نظام الصلاحيات في الكود:

```typescript
import { hasPermission, checkPermission } from './permissions';

// Check if user has permission
if (hasPermission(userRole, 'appointments', 'create')) {
  // Allow creating appointments
}

// Use as middleware
app.post('/api/appointments', 
  authMiddleware,
  checkPermission('appointments', 'create'),
  createAppointment
);
```

</div>

## Important Notes:

1. **Flexibility**: Permissions can be customized per hospital needs
2. **Security**: All operations are logged in Audit Log
3. **Sensitive Data**: Medical records are protected and can only be deleted by admins
4. **Overlapping Permissions**: Some roles have similar permissions for collaboration
5. **Continuous Development**: New roles and permissions can be added as needed

## Using the Permission System in Code:

```typescript
import { hasPermission, checkPermission } from './permissions';

// Check if user has permission
if (hasPermission(userRole, 'appointments', 'create')) {
  // Allow creating appointments
}

// Use as middleware
app.post('/api/appointments', 
  authMiddleware,
  checkPermission('appointments', 'create'),
  createAppointment
);
```
