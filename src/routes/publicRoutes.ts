import { Router, Request, Response } from 'express';
import { Clinic, Tenant } from '../models';

const router = Router();

/**
 * Get active clinics for a tenant (public endpoint for registration)
 * Can be filtered by tenant_id or subdomain
 * No authentication required
 */
router.get('/clinics', async (req: Request, res: Response) => {
  try {
    const { tenant_id, subdomain } = req.query;
    
    let tenantId = tenant_id as string | undefined;
    
    // If subdomain is provided, resolve it to tenant_id
    if (subdomain && !tenantId) {
      const tenant = await Tenant.findOne({ 
        subdomain: subdomain as string,
        status: 'active'
      });
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found for this subdomain'
        });
      }
      
      tenantId = tenant._id.toString();
    }
    
    // Build query
    const query: any = { is_active: true };
    if (tenantId) {
      query.tenant_id = tenantId;
    }
    
    // Get clinics with limited fields for public view
    const clinics = await Clinic.find(query)
      .select('name code address contact description')
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      data: clinics,
      count: clinics.length
    });
  } catch (error: any) {
    console.error('Error fetching public clinics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clinics'
    });
  }
});

export default router;
