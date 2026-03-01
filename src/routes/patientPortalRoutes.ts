import { Router } from 'express';
import { PatientPortalController } from '../controllers/patientPortalController';
import { authenticate, authorize } from '../middleware/auth';
import { clinicContext } from '../middleware/clinicContext';

const router = Router();

// All patient portal routes require authentication as a patient and clinic context
router.use(authenticate);
router.use(authorize('patient'));
router.use(clinicContext);

// Patient portal routes
router.get('/profile', PatientPortalController.getMyProfile);
router.get('/appointments', PatientPortalController.getMyAppointments);
router.get('/prescriptions', PatientPortalController.getMyPrescriptions);
router.get('/invoices', PatientPortalController.getMyInvoices);
router.get('/dashboard-stats', PatientPortalController.getDashboardStats);

export default router;

