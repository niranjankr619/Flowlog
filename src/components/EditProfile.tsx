import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Mail, Phone, MapPin, Briefcase, Building, Save } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { mockUser } from '../lib/mockData';

export const EditProfile = () => {
  const { setCurrentScreen } = useApp();
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    role: mockUser.role,
    department: 'Engineering Division',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setCurrentScreen('profile');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* Header */}
      <div className="sticky top-0 z-20 glass-overlay border-b border-border/30">
        <div className="px-4 py-4 safe-top">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentScreen('profile')}
                className="p-2 hover:bg-muted rounded-lg transition-all"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              </button>
              <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Edit Profile
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6 safe-bottom">
        <div className="px-4 pt-6 max-w-md mx-auto space-y-6">
          
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-3">
              {/* Rotating border frame */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, #4B5CFB, #00C7B7, #4B5CFB)',
                  padding: '3px',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className="w-full h-full rounded-3xl bg-background" />
              </motion.div>
              
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-3xl">
                <Avatar className="w-full h-full rounded-3xl overflow-hidden">
                  <AvatarImage src={mockUser.avatar} />
                  <AvatarFallback style={{ fontWeight: 700 }}>
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera icon overlay */}
                <motion.button
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toast.info('Avatar upload coming soon!')}
                >
                  <Camera className="w-5 h-5 text-white" strokeWidth={2} />
                </motion.button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
              Tap to change profile picture
            </p>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              PERSONAL INFORMATION
            </p>
            <div className="rounded-2xl p-4 space-y-4 bg-card border-2 border-border/40 shadow-sm">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background/50 border-border/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={2} />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/50 border-border/50 pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={2} />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background/50 border-border/50 pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={2} />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-background/50 border-border/50 pl-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Work Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              WORK INFORMATION
            </p>
            <div className="rounded-2xl p-4 space-y-4 bg-card border-2 border-border/40 shadow-sm">
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                  Job Title
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={2} />
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="bg-background/50 border-border/50 pl-10"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                  Department
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={2} />
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-background/50 border-border/50 pl-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              ACCOUNT ACTIONS
            </p>
            <div className="space-y-2">
              <motion.button
                onClick={() => toast.info('Change password feature coming soon!')}
                className="w-full p-4 rounded-xl bg-card hover:bg-card/80 border-2 border-border/40 hover:border-border transition-all text-left shadow-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Change Password
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your account password
                </p>
              </motion.button>

              <motion.button
                onClick={() => toast.info('This would log you out and delete local data')}
                className="w-full p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/30 hover:border-destructive/50 transition-all text-left shadow-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <p className="text-sm text-destructive" style={{ fontWeight: 600 }}>
                  Delete Account
                </p>
                <p className="text-xs text-destructive/70 mt-0.5">
                  Permanently delete your account and all data
                </p>
              </motion.button>
            </div>
          </motion.div>

          {/* Save Button - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2 pb-8"
          >
            <motion.button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #00C7B7 0%, #4B5CFB 100%)',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" strokeWidth={2} />
              <span style={{ fontWeight: 600 }}>Save Changes</span>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
