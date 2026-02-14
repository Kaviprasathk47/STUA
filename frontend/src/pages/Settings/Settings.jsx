import { useState } from 'react';
import { User, Lock, Settings as SettingsIcon } from 'lucide-react';
import ProfileSettings from './components/ProfileSettings';
import PasswordSettings from './components/PasswordSettings';
import PreferencesSettings from './components/PreferencesSettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'password', label: 'Password', icon: Lock },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    ];

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
                <p className="text-slate-500">Manage your profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <nav className="flex flex-col">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-emerald-50 text-emerald-600 font-medium border-l-4 border-emerald-600'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="space-y-6">
                        {activeTab === 'profile' && <ProfileSettings />}
                        {activeTab === 'password' && <PasswordSettings />}
                        {activeTab === 'preferences' && <PreferencesSettings />}
                    </div>
                </div>
            </div>

            <footer className="text-center text-xs text-slate-500 mt-12">
                Account settings are securely managed and apply only to your profile.
            </footer>
        </div>
    );
};

export default Settings;
