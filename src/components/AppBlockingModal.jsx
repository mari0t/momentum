import React, { useState } from 'react'
import { Shield, Bell, Smartphone, X } from 'lucide-react'

export default function AppBlockingModal({ onClose }) {
  const [focusModeSettings, setFocusModeSettings] = useState({
    blockNotifications: true,
    blockSocialMedia: true,
    blockEntertainment: true,
    allowCalls: false,
    allowMessages: false
  })

  const saveSettings = () => {
    // Here you would implement actual app blocking functionality
    console.log('Focus mode settings saved:', focusModeSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              Ustawienia Focus Mode
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Notification Settings */}
            <div>
              <h4 className="font-medium text-gray-100 mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary-600" />
                Powiadomienia
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={focusModeSettings.blockNotifications}
                    onChange={(e) => setFocusModeSettings(prev => ({ 
                      ...prev, 
                      blockNotifications: e.target.checked 
                    }))}
                    className="mr-3 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">Blokuj wszystkie powiadomienia</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={focusModeSettings.allowCalls}
                    onChange={(e) => setFocusModeSettings(prev => ({ 
                      ...prev, 
                      allowCalls: e.target.checked 
                    }))}
                    className="mr-3 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">Pozwól na połączenia telefoniczne</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={focusModeSettings.allowMessages}
                    onChange={(e) => setFocusModeSettings(prev => ({ 
                      ...prev, 
                      allowMessages: e.target.checked 
                    }))}
                    className="mr-3 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">Pozwól na wiadomości</span>
                </label>
              </div>
            </div>

            {/* App Blocking */}
            <div>
              <h4 className="font-medium text-gray-100 mb-3">Blokowanie aplikacji</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={focusModeSettings.blockSocialMedia}
                    onChange={(e) => setFocusModeSettings(prev => ({ 
                      ...prev, 
                      blockSocialMedia: e.target.checked 
                    }))}
                    className="mr-3 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">Blokuj media społecznościowe</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={focusModeSettings.blockEntertainment}
                    onChange={(e) => setFocusModeSettings(prev => ({ 
                      ...prev, 
                      blockEntertainment: e.target.checked 
                    }))}
                    className="mr-3 w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">Blokuj rozrywkę (YouTube, Netflix)</span>
                </label>
              </div>
            </div>

            {/* iOS Specific Features */}
            <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-700">
              <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Funkcje iOS
              </h4>
              <div className="text-sm text-blue-200 space-y-2">
                <p>• <strong>Screen Time:</strong> Ustaw limity dla aplikacji</p>
                <p>• <strong>Focus:</strong> Włącz tryb Focus w ustawieniach iOS</p>
                <p>• <strong>App Limits:</strong> Ogranicz czas używania social media</p>
                <p>• <strong>Downtime:</strong> Zaplanuj czas bez aplikacji</p>
              </div>
            </div>

            {/* Android Specific Features */}
            <div className="p-4 bg-green-900/20 rounded-xl border border-green-700">
              <h4 className="font-medium text-green-300 mb-2">Funkcje Android</h4>
              <div className="text-sm text-green-200 space-y-2">
                <p>• <strong>Digital Wellbeing:</strong> Ustaw limity aplikacji</p>
                <p>• <strong>Focus Mode:</strong> Włącz tryb skupienia</p>
                <p>• <strong>App Timer:</strong> Ogranicz czas używania</p>
                <p>• <strong>Bedtime Mode:</strong> Tryb nocny</p>
              </div>
            </div>

            {/* Current Status */}
            <div className="p-4 bg-gray-700 rounded-xl">
              <h4 className="font-medium text-gray-100 mb-2">Status Focus Mode</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Powiadomienia:</span>
                  <span className={focusModeSettings.blockNotifications ? 'text-red-400' : 'text-green-400'}>
                    {focusModeSettings.blockNotifications ? 'Zablokowane' : 'Dozwolone'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Social Media:</span>
                  <span className={focusModeSettings.blockSocialMedia ? 'text-red-400' : 'text-green-400'}>
                    {focusModeSettings.blockSocialMedia ? 'Zablokowane' : 'Dozwolone'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rozrywka:</span>
                  <span className={focusModeSettings.blockEntertainment ? 'text-red-400' : 'text-green-400'}>
                    {focusModeSettings.blockEntertainment ? 'Zablokowane' : 'Dozwolone'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveSettings}
              className="btn-primary w-full"
            >
              Zapisz ustawienia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
