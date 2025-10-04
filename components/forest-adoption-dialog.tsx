'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { adoptionApi } from '@/lib/api';
import { AxiosError } from 'axios';

interface ForestAdoptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forestId: string;
  forestName: string;
  onAdoptionSuccess?: (guardianEmail: string) => void;
}

export default function ForestAdoptionDialog({
  open,
  onOpenChange,
  forestId,
  forestName,
  onAdoptionSuccess,
}: ForestAdoptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [adoptionForm, setAdoptionForm] = useState({
    guardian_name: '',
    guardian_email: '',
    telegram_chat_id: '',
  });

  const handleAdoptForest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adoptionForm.guardian_name || !adoptionForm.guardian_email) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await adoptionApi.adoptForest({
        forest_id: forestId,
        guardian_name: adoptionForm.guardian_name,
        guardian_email: adoptionForm.guardian_email,
        telegram_chat_id: adoptionForm.telegram_chat_id || null,
      });

      setSuccess(true);

      // Llamar al callback de éxito si existe
      if (onAdoptionSuccess) {
        onAdoptionSuccess(adoptionForm.guardian_email);
      }

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setAdoptionForm({ guardian_name: '', guardian_email: '', telegram_chat_id: '' });
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Heart className="text-green-600 h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Adopta tu Bosque</DialogTitle>
              <DialogDescription>
                Conviértete en guardián digital de la Amazonía
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-green-600 h-10 w-10 fill-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Felicidades!
            </h3>
            <p className="text-gray-600">
              Adoptaste {forestName}. Revisa tu email para más detalles.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-4 border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-2">{forestName}</h4>
              <p className="text-sm text-green-700">
                Al adoptar este bosque, recibirás alertas en tiempo real y reportes de salud.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAdoptForest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guardian_name">
                  Tu nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guardian_name"
                  type="text"
                  required
                  value={adoptionForm.guardian_name}
                  onChange={(e) =>
                    setAdoptionForm({ ...adoptionForm, guardian_name: e.target.value })
                  }
                  placeholder="Ej: María López"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardian_email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="guardian_email"
                  type="email"
                  required
                  value={adoptionForm.guardian_email}
                  onChange={(e) =>
                    setAdoptionForm({ ...adoptionForm, guardian_email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Recibirás alertas de incendios y reportes de salud del bosque
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram_chat_id">Telegram Chat ID (opcional)</Label>
                <Input
                  id="telegram_chat_id"
                  type="text"
                  value={adoptionForm.telegram_chat_id}
                  onChange={(e) =>
                    setAdoptionForm({ ...adoptionForm, telegram_chat_id: e.target.value })
                  }
                  placeholder="123456789"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Para recibir alertas instantáneas por Telegram
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  ¿Qué obtienes como Guardián?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>🔥 Alertas en tiempo real de incendios cercanos</li>
                  <li>📊 Reportes mensuales de salud del bosque (NDVI)</li>
                  <li>🏆 Puntos y niveles por proteger el bosque</li>
                  <li>🌍 Impacto medible en conservación</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adoptando...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Adoptar Bosque
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
