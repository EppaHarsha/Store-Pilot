import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService.js";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    authService
      .getProfile()
      .then((data) => {
        if (isMounted) {
          setProfile(data);
        }
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Could not load profile. Please try again.";
        if (isMounted) {
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
      {loading && <p className="text-sm text-slate-600">Loading profile…</p>}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}
      {profile && (
        <div className="card-soft p-4 text-sm text-slate-700">
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs font-medium text-slate-500">Name</div>
              <div>{profile.name}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Email</div>
              <div>{profile.email}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Account created</div>
              <div>
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleString()
                  : "Unknown"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

