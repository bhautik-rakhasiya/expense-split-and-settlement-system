import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-brand-50 to-slate-100 flex items-center justify-center p-4">
    <div className="text-center animate-slide-up">
      {/* 404 graphic */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-xl mb-6">
        <span className="text-4xl">🔍</span>
      </div>

      <h1 className="text-7xl font-extrabold text-brand-600 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        to="/groups"
        className="btn-primary inline-flex shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
