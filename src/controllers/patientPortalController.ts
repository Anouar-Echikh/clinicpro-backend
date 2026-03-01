import { Response } from 'express';
import { Patient, Appointment, Prescription, Invoice, User } from '../models';
import { AuthRequest } from '../types/express';
import { getTenantScopedFilter } from '../middleware/auth';

/**
 * PatientPortalController
 * 
 * This controller handles patient-specific operations where patients can access their own data.
 * Patients must be authenticated and can only view their own information.
 */
export class PatientPortalController {
  /**
   * Get patient's own profile information
   */
  static async getMyProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the patient record associated with this user
      // Match by email since patient and user are different entities
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const filter = getTenantScopedFilter(req, {
        email: user.email
      });

      const patient = await Patient.findOne(filter);

      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          patient,
          user: {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role
          }
        }
      });
    } catch (error: any) {
      console.error('Get patient profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get patient's own appointments
   */
  static async getMyAppointments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the patient record associated with this user
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Find patient by email
      const patientFilter = getTenantScopedFilter(req, {
        email: user.email
      });

      const patient = await Patient.findOne(patientFilter);

      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
        return;
      }

      // Query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = getTenantScopedFilter(req, {
        patient_id: patient._id,
        clinic_id: req.clinic_id
      });

      if (status) {
        filter.status = status;
      }

      const appointments = await Appointment.find(filter)
        .populate('doctor_id', 'first_name last_name specialization')
        .populate('nurse_id', 'first_name last_name')
        .sort({ appointment_date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Appointment.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          appointments,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit
          }
        }
      });
    } catch (error: any) {
      console.error('Get patient appointments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get patient's own prescriptions
   */
  static async getMyPrescriptions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the patient record associated with this user
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Find patient by email
      const patientFilter = getTenantScopedFilter(req, {
        email: user.email
      });

      const patient = await Patient.findOne(patientFilter);

      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
        return;
      }

      // Query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = getTenantScopedFilter(req, {
        patient_id: patient._id,
        clinic_id: req.clinic_id
      });

      if (status) {
        filter.status = status;
      }

      const prescriptions = await Prescription.find(filter)
        .populate('doctor_id', 'first_name last_name specialization')
        .populate('appointment_id')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Prescription.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          prescriptions,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit
          }
        }
      });
    } catch (error: any) {
      console.error('Get patient prescriptions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get patient's own invoices
   */
  static async getMyInvoices(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the patient record associated with this user
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Find patient by email
      const patientFilter = getTenantScopedFilter(req, {
        email: user.email
      });

      const patient = await Patient.findOne(patientFilter);

      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
        return;
      }

      // Query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = getTenantScopedFilter(req, {
        patient_id: patient._id,
        clinic_id: req.clinic_id
      });

      if (status) {
        filter.status = status;
      }

      const invoices = await Invoice.find(filter)
        .populate('patient_id', 'first_name last_name email phone')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Invoice.countDocuments(filter);

      // Calculate summary
      const summary = {
        total_amount: 0,
        paid_amount: 0,
        pending_amount: 0
      };

      invoices.forEach(invoice => {
        summary.total_amount += invoice.total_amount || 0;
        if (invoice.status === 'paid') {
          summary.paid_amount += invoice.total_amount || 0;
        } else {
          summary.pending_amount += invoice.total_amount || 0;
        }
      });

      res.status(200).json({
        success: true,
        data: {
          invoices,
          summary,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit
          }
        }
      });
    } catch (error: any) {
      console.error('Get patient invoices error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get patient's dashboard statistics
   */
  static async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Find the patient record associated with this user
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Find patient by email
      const patientFilter = getTenantScopedFilter(req, {
        email: user.email
      });

      const patient = await Patient.findOne(patientFilter);

      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
        return;
      }

      const baseFilter = getTenantScopedFilter(req, {
        patient_id: patient._id,
        clinic_id: req.clinic_id
      });

      // Get statistics
      const [
        totalAppointments,
        upcomingAppointments,
        totalPrescriptions,
        activePrescriptions,
        totalInvoices,
        pendingInvoices
      ] = await Promise.all([
        Appointment.countDocuments(baseFilter),
        Appointment.countDocuments({
          ...baseFilter,
          appointment_date: { $gte: new Date() },
          status: { $in: ['scheduled', 'confirmed'] }
        }),
        Prescription.countDocuments(baseFilter),
        Prescription.countDocuments({
          ...baseFilter,
          status: 'active'
        }),
        Invoice.countDocuments(baseFilter),
        Invoice.countDocuments({
          ...baseFilter,
          status: { $in: ['pending', 'overdue'] }
        })
      ]);

      // Get next appointment
      const nextAppointment = await Appointment.findOne({
        ...baseFilter,
        appointment_date: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
      })
        .populate('doctor_id', 'first_name last_name specialization')
        .sort({ appointment_date: 1 });

      res.status(200).json({
        success: true,
        data: {
          stats: {
            total_appointments: totalAppointments,
            upcoming_appointments: upcomingAppointments,
            total_prescriptions: totalPrescriptions,
            active_prescriptions: activePrescriptions,
            total_invoices: totalInvoices,
            pending_invoices: pendingInvoices
          },
          next_appointment: nextAppointment
        }
      });
    } catch (error: any) {
      console.error('Get patient dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

