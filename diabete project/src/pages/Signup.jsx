import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteUser } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { createUserProfile } from '../lib/firestore';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [diabetesType, setDiabetesType] = useState('Type 1');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setIsLoading(true);

        try {
            // 1. Create Auth User
            const userCredential = await register(email, password);
            const user = userCredential.user;

            try {
                // 1.5 Set Display Name
                await updateProfile(user, { displayName: name });

                // 2. Create Firestore Profile
                await createUserProfile(user.uid, {
                    name,
                    email,
                    diabetesType
                });

                await logout();
                navigate('/login');
            } catch (profileErr) {
                // Rollback: If Firestore fails (e.g. rules issue), delete the auth user
                await deleteUser(user).catch(console.error);
                throw new Error("Could not construct your profile (Database Error). The account creation was rolled back.");
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: "url('/images/diabetes-bg.png')" }}
        >
            {/* Removed overlay for maximum clarity */}
            <div className="absolute inset-0"></div>

            {/* Relative positioning to sit above the absolute overlay */}
            <Card className="w-full max-w-md relative z-10 glass-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="diabetesType">
                                Diabetes Type
                            </label>
                            <select
                                id="diabetesType"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={diabetesType}
                                onChange={(e) => setDiabetesType(e.target.value)}
                            >
                                <option value="Type 1">Type 1</option>
                                <option value="Type 2">Type 2</option>
                                <option value="Gestational">Gestational</option>
                                <option value="Prediabetes">Prediabetes</option>
                                <option value="LADA">LADA</option>
                                <option value="MODY">MODY</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <Button className="w-full" type="submit" isLoading={isLoading}>
                            Sign Up
                        </Button>

                        <div className="text-center text-sm text-slate-500 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
