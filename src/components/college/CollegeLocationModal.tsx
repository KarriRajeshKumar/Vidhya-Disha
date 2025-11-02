import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

interface College {
  id: number;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
}

interface CollegeLocationModalProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CollegeLocationModal({ college, isOpen, onClose }: CollegeLocationModalProps) {
  if (!college) return null;

  // Create Google Maps embed URL (works without API key for basic view)
  const mapUrl = `https://maps.google.com/maps?q=${college.latitude},${college.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // Create Google Maps URL for external link
  const googleMapsUrl = `https://www.google.com/maps?q=${college.latitude},${college.longitude}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {college.name} - Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* College Information */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{college.name}</h3>
            <p className="text-muted-foreground mb-2">{college.address}</p>
            <p className="text-sm text-primary font-medium">{college.type}</p>
            <div className="mt-3 text-sm text-muted-foreground">
              <p><strong>Coordinates:</strong></p>
              <p>Latitude: {college.latitude.toFixed(6)}</p>
              <p>Longitude: {college.longitude.toFixed(6)}</p>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="h-96 w-full rounded-lg overflow-hidden border">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title={`Map showing ${college.name} location`}
              loading="lazy"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Interactive map showing the college location
            </p>
            <Button
              variant="outline"
              onClick={() => window.open(googleMapsUrl, '_blank')}
              className="flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Google Maps
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}