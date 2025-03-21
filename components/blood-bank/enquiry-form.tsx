"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function EnquiryForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    purpose: 'requirement', // 'requirement' or 'donation'
    urgency: 'normal', // 'urgent' or 'normal'
    acceptTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePurposeChange = (value: string) => {
    setFormData(prev => ({ ...prev, purpose: value }));
  };

  const handleUrgencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, urgency: value }));
  };

  const handleTermsChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.bloodType || !formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate form submission
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Submitted",
        description: "We'll contact you shortly.",
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        bloodType: '',
        purpose: 'requirement',
        urgency: 'normal',
        acceptTerms: false
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-sm">Name*</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="John Doe" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-sm">Phone*</Label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="+91 98765 43210" 
            value={formData.phone}
            onChange={handleChange}
            required 
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="bloodType" className="text-sm">Blood Type*</Label>
        <Select 
          value={formData.bloodType} 
          onValueChange={(value) => handleSelectChange('bloodType', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select blood type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1">
        <Label className="text-sm">Purpose*</Label>
        <RadioGroup 
          defaultValue="requirement" 
          value={formData.purpose}
          onValueChange={handlePurposeChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="requirement" id="requirement" />
            <Label htmlFor="requirement" className="text-sm font-normal">
              Need blood
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="donation" id="donation" />
            <Label htmlFor="donation" className="text-sm font-normal">
              Donate blood
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {formData.purpose === "requirement" && (
        <div className="space-y-1">
          <Label className="text-sm">Urgency Level</Label>
          <RadioGroup 
            defaultValue="normal" 
            value={formData.urgency}
            onValueChange={handleUrgencyChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent" className="text-sm font-normal text-red-600 dark:text-red-400">
                Urgent (24h)
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal" className="text-sm font-normal">
                Normal
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      <div className="flex items-start space-x-2 pt-1">
        <Checkbox 
          id="terms" 
          checked={formData.acceptTerms}
          onCheckedChange={handleTermsChange}
          required
        />
        <Label htmlFor="terms" className="text-xs font-normal leading-tight">
          I agree to be contacted regarding this blood enquiry.
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
} 