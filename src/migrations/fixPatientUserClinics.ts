import mongoose from 'mongoose';
import { User, UserClinic, Clinic } from '../models';

/**
 * Migration script to create missing UserClinic records for existing patient users
 * This fixes patients who were created without UserClinic relationships
 */
export async function fixPatientUserClinics() {
  try {
    console.log('🔧 Starting migration: Fix Patient UserClinic records');
    
    // Find all users with role 'patient'
    const patientUsers = await User.find({ role: 'patient' });
    console.log(`Found ${patientUsers.length} patient users`);
    
    let fixed = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const user of patientUsers) {
      try {
        // Check if UserClinic already exists
        const existingUserClinic = await UserClinic.findOne({
          user_id: user._id,
          clinic_id: user.clinic_id
        });
        
        if (existingUserClinic) {
          console.log(`  ✓ UserClinic already exists for ${user.email}`);
          skipped++;
          continue;
        }
        
        // Get clinic details
        const clinic = await Clinic.findById(user.clinic_id);
        if (!clinic) {
          console.error(`  ✗ Clinic not found for user ${user.email}`);
          errors++;
          continue;
        }
        
        // Create UserClinic record
        const userClinicData = {
          tenant_id: user.tenant_id,
          user_id: user._id,
          clinic_id: user.clinic_id,
          roles: [], // Empty roles array for now
          permission_overrides: [],
          is_active: true,
          joined_at: user.created_at || new Date()
        };
        
        await UserClinic.create(userClinicData);
        console.log(`  ✅ Created UserClinic for ${user.email}`);
        fixed++;
        
      } catch (userError: any) {
        console.error(`  ✗ Error processing user ${user.email}:`, userError.message);
        errors++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`  ✅ Fixed: ${fixed}`);
    console.log(`  ✓ Skipped (already exists): ${skipped}`);
    console.log(`  ✗ Errors: ${errors}`);
    console.log(`  📝 Total processed: ${patientUsers.length}`);
    
    console.log('\n✅ Migration completed successfully');
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// If running directly
if (require.main === module) {
  const runMigration = async () => {
    try {
      // Connect to database
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_pro';
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to database');
      
      // Run migration
      await fixPatientUserClinics();
      
      // Disconnect
      await mongoose.disconnect();
      console.log('✅ Disconnected from database');
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    }
  };
  
  runMigration();
}

