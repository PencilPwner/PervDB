'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import html2canvas from 'html2canvas';

export default function Home() {
  const [photo, setPhoto] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [marriedTo, setMarriedTo] = useState<string>('');
  const [status, setStatus] = useState<'contacted' | 'uncontacted'>('uncontacted');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSendToDB = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo,
          name: `${lastName},${firstName}`,
          address,
          phoneNumber,
          marriedTo,
          status,
        }),
      });

      if (response.ok) {
        setPhoto('');
        setLastName('');
        setFirstName('');
        setAddress('');
        setPhoneNumber('');
        setMarriedTo('');
        setStatus('uncontacted');
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving to database:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportAsPNG = async () => {
    if (formRef.current) {
      try {
        const canvas = await html2canvas(formRef.current, {
          backgroundColor: '#000000',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `person-record-${lastName || 'unknown'}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error exporting as PNG:', error);
      }
    }
  };

  const exportAsJSON = () => {
    const data = {
      photo,
      name: `${lastName},${firstName}`,
      address,
      phoneNumber,
      marriedTo,
      status,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `person-record-${lastName || 'unknown'}-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.name) {
            const nameParts = data.name.split(',');
            setLastName(nameParts[0] || '');
            setFirstName(nameParts[1] || '');
          }
          
          setPhoto(data.photo || '');
          setAddress(data.address || '');
          setPhoneNumber(data.phoneNumber || '');
          setMarriedTo(data.marriedTo || '');
          setStatus(data.status || 'uncontacted');
          
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
          console.error('Error importing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const exportAllRecords = async () => {
    try {
      const response = await fetch('/api/people/export');
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = `all-people-records-${Date.now()}.json`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (error) {
      console.error('Error exporting all records:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 border-b border-gray-400 pb-4">
          <h1 className="text-4xl font-bold tracking-wider uppercase text-white">PERSONS DATABASE</h1>
          <p className="text-sm mt-2 tracking-widest text-gray-400">RECORDS DIVISION</p>
        </div>

        <Card ref={formRef} className="border border-gray-400 bg-black shadow-none rounded-none">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="border border-gray-400 p-4 bg-gray-900 rounded-none">
                  <Label className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">PHOTO</Label>
                  <div className="relative">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Person"
                        className="w-full h-64 object-cover border border-gray-400 rounded-none"
                      />
                    ) : (
                      <div className="w-full h-64 border border-gray-400 bg-black flex items-center justify-center rounded-none">
                        <span className="text-xs tracking-widest uppercase text-gray-500">NO PHOTO</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">LAST NAME</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-gray-400 bg-black text-white font-mono rounded-none focus:border-gray-300"
                      placeholder="ENTER LAST NAME"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">FIRST NAME</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-gray-400 bg-black text-white font-mono rounded-none focus:border-gray-300"
                      placeholder="ENTER FIRST NAME"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">ADDRESS</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-400 bg-black text-white font-mono rounded-none focus:border-gray-300"
                    placeholder="ENTER ADDRESS"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">PHONE NUMBER</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border border-gray-400 bg-black text-white font-mono rounded-none focus:border-gray-300"
                    placeholder="ENTER PHONE NUMBER"
                  />
                </div>

                <div>
                  <Label htmlFor="marriedTo" className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">MARRIED TO</Label>
                  <Input
                    id="marriedTo"
                    value={marriedTo}
                    onChange={(e) => setMarriedTo(e.target.value)}
                    className="border border-gray-400 bg-black text-white font-mono rounded-none focus:border-gray-300"
                    placeholder="ENTER SPOUSE NAME"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-bold mb-2 tracking-wider uppercase text-gray-300">STATUS</Label>
                  <Select value={status} onValueChange={(value: 'contacted' | 'uncontacted') => setStatus(value)}>
                    <SelectTrigger className="border border-gray-400 bg-black text-white font-mono rounded-none focus:border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-400 bg-black rounded-none">
                      <SelectItem value="contacted" className="font-mono text-white hover:bg-gray-800 focus:bg-gray-800">CONTACTED</SelectItem>
                      <SelectItem value="uncontacted" className="font-mono text-white hover:bg-gray-800 focus:bg-gray-800">UNCONTACTED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-400 flex-wrap">
              <Button
                onClick={handleSave}
                className="bg-gray-200 text-black px-6 py-3 text-lg font-bold tracking-wider uppercase hover:bg-gray-300 border border-gray-400 rounded-none"
              >
                SAVE
              </Button>
              <Button
                onClick={handleSendToDB}
                disabled={isSubmitting}
                className="bg-black text-white px-6 py-3 text-lg font-bold tracking-wider uppercase hover:bg-gray-900 border border-gray-400 rounded-none"
              >
                {isSubmitting ? 'PROCESSING...' : 'SEND TO DB'}
              </Button>
              <Button
                onClick={exportAsPNG}
                className="bg-gray-800 text-white px-6 py-3 text-lg font-bold tracking-wider uppercase hover:bg-gray-700 border border-gray-400 rounded-none"
              >
                EXPORT PNG
              </Button>
              <Button
                onClick={exportAsJSON}
                className="bg-gray-800 text-white px-6 py-3 text-lg font-bold tracking-wider uppercase hover:bg-gray-700 border border-gray-400 rounded-none"
              >
                EXPORT JSON
              </Button>
              <Button
                onClick={exportAllRecords}
                className="bg-gray-700 text-white px-6 py-3 text-lg font-bold tracking-wider uppercase hover:bg-gray-600 border border-gray-400 rounded-none"
              >
                EXPORT ALL
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-800 text-white px-6 py-3 text-lg font-bold tracking-wider uppercase hover:bg-gray-700 border border-gray-400 rounded-none"
              >
                IMPORT JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importJSON}
                className="hidden"
              />
            </div>

            {isSaved && (
              <div className="mt-4 p-4 border border-gray-400 bg-gray-200 text-black text-center font-bold tracking-wider uppercase rounded-none">
                {isSubmitting ? 'PROCESSING...' : 'RECORD SAVED'}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 border-t border-gray-400 pt-4">
          <p className="text-xs tracking-widest uppercase text-gray-500">CONFIDENTIAL - FOR OFFICIAL USE ONLY</p>
        </div>
      </div>
    </div>
  );
}