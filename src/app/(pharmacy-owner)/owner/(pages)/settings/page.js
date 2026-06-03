// app/setting/page.js

"use client";

import { Store, Clock3, MapPin, ImagePlus, Save, ImageOff } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { InputField } from "../../components/setting/InputField";
import { NotificationSetting } from "../../components/setting/NotificationSetting";
import { BusinessHourGroup } from "../../components/setting/BussinessHourGroupSetting";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const getLogoUrl = (logo) => {
  if (!logo) return null;

  const isExternal = logo.startsWith("http");

  if (isExternal) return logo;

  return `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${logo}`;
};

const isValidGoogleMapUrl = (url) => {
  if (!url) return true;

  return /^(https?:\/\/)?(www\.)?(google\.com\/maps.*|maps\.app\.goo\.gl\/.*)$/i.test(
    url,
  );
};

export default function SettingPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  // =========================
  // STORE SETTING
  // =========================
  const [setting, setSetting] = useState({
    pharmacy_name: "",
    owner_name: "",
    address: "",
    city: "",
    gps_location: "",
    phone_number: "",
    displayable_email: "",
    logo: "",
  });

  // =========================
  // BUSINESS HOURS
  // =========================
  const [businessHours, setBusinessHours] = useState([]);

  const normalizeTime = (t) => {
    if (!t || t === "") return null;

    // already valid 24h format
    const match = t.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

    return match ? t : null;
  };

  // =========================
  // FETCH
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [settingRes, businessRes] = await Promise.all([
        api.get("/owner/setting/getSetting"),
        api.get("/owner/business-hour/getBusinessHour"),
      ]);

      setSetting(settingRes.data.data);

      // normalize
const normalized = DAYS.map((day) => {
  const found = businessRes.data.find((item) => item.day_of_week === day);

  if (!found) {
    return {
      id: null,
      day_of_week: day,
      open_time: "",
      close_time: "",
      is_open: false,
    };
  }

  return {
    ...found,
    open_time: found.open_time?.slice(0, 5) || "",
    close_time: found.close_time?.slice(0, 5) || "",
  };
});

      setBusinessHours(normalized);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // CHANGE SETTING
  // =========================
  const handleSettingChange = (e) => {
    const { name, value } = e.target;

    // validate google map link
    if (name === "gps_location") {
      if (!isValidGoogleMapUrl(value)) {
        setGpsError("Please enter a valid Google Maps link");
      } else {
        setGpsError("");
      }
    }

    setSetting({
      ...setting,
      [name]: value,
    });
  };





  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const saveProfile = async () => {
    const missingFields = [];

    if (!setting.pharmacy_name?.trim()) missingFields.push("Pharmacy Name");
    if (!setting.owner_name?.trim()) missingFields.push("Owner Name");
    if (!setting.address?.trim()) missingFields.push("Address");
    if (!setting.city?.trim()) missingFields.push("City");
    if (!setting.phone_number?.trim()) missingFields.push("Phone Number");

    if (missingFields.length > 0) {
      toast.error(`Missing: ${missingFields.join(", ")}`);
      return;
    }

    if (gpsError) {
      toast.error("Please fix Google Maps link first");
      return;
    }

    const toastId = toast.loading("Saving profile...");
    setSavingProfile(true);

    try {
      const formData = new FormData();

      formData.append("pharmacy_name", setting.pharmacy_name.trim());
      formData.append("owner_name", setting.owner_name.trim());
      formData.append("address", setting.address.trim());
      formData.append("city", setting.city.trim());
      formData.append("phone_number", setting.phone_number.trim());
      formData.append(
        "displayable_email",
        setting.displayable_email?.trim() || "",
      );

      if (setting.gps_location && isValidGoogleMapUrl(setting.gps_location)) {
        formData.append("gps_location", setting.gps_location.trim());
      }

      await api.post("/owner/setting/updateSetting", formData);

      toast.success("Profile updated", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setSavingProfile(false);
    }
  };
  const uploadLogo = async () => {
    if (!logoFile) {
      toast.error("Please select a logo first");
      return;
    }

    const toastId = toast.loading("Uploading logo...");
    setSavingLogo(true);

    try {
      const formData = new FormData();
      formData.append("logo", logoFile);

      const res = await api.post("/owner/setting/uploadLogo", formData);

      setSetting((prev) => ({
        ...prev,
        logo: res.data.data.logo_url,
      }));

      toast.success("Logo updated", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload logo", { id: toastId });
    } finally {
      setSavingLogo(false);
    }
  };

  const saveBusinessHours = async () => {
   
    const toastId = toast.loading("Saving business hours...");
    setSavingHours(true);

    try {
      const groups = [
        {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          open_time: normalizeTime(
            businessHours.find((d) => d.day_of_week === "monday")?.open_time,
          ),
          close_time: normalizeTime(
            businessHours.find((d) => d.day_of_week === "monday")?.close_time,
          ),
          is_open: businessHours.find((d) => d.day_of_week === "monday")
            ?.is_open,
        },
        {
          days: ["saturday", "sunday"],
          open_time: normalizeTime(
            businessHours.find((d) => d.day_of_week === "saturday")?.open_time,
          ),
          close_time: normalizeTime(
            businessHours.find((d) => d.day_of_week === "saturday")?.close_time,
          ),
          is_open: businessHours.find((d) => d.day_of_week === "saturday")
            ?.is_open,
        },
      ];

      console.log(JSON.stringify({ groups }, null, 2));
      await api.post("/owner/business-hour/bulk", { groups });

      toast.success("Business hours updated", { id: toastId });
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to update business hours", { id: toastId });
    } finally {
      setSavingHours(false);
    }
  };

  // =========================
  // LOADING SKELETON
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] p-6">
        <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-gray-200 bg-white p-6"
            >
              <div className="h-5 w-48 bg-gray-200 rounded mb-6" />

              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-12 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* ========================= */}
        {/* STORE INFO */}
        {/* ========================= */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-pink-100 p-2 text-pink-500">
              <Store size={16} />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Store Information
            </h2>
          </div>

          <div className="space-y-5">
            {/* Pharmacy */}
            <InputField
              label="Pharmacy Name"
              name="pharmacy_name"
              value={setting.pharmacy_name}
              onChange={handleSettingChange}
              required
            />

            {/* Owner */}
            <InputField
              label="Owner Name"
              name="owner_name"
              value={setting.owner_name}
              onChange={handleSettingChange}
              required
            />

            {/* Address */}
            <InputField
              label="Store Address"
              name="address"
              value={setting.address}
              onChange={handleSettingChange}
              required
            />

            {/* City */}
            <InputField
              label="City"
              name="city"
              value={setting.city}
              onChange={handleSettingChange}
              required
            />

            {/* GPS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Google Map Link URL (Store Location)
              </label>

              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="gps_location"
                  value={setting.gps_location || ""}
                  onChange={handleSettingChange}
                  placeholder="Paste Google Maps link"
                  required
                  className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm outline-none ${
                    gpsError
                      ? "border-red-400"
                      : "border-gray-200 focus:border-pink-400"
                  }`}
                />

                {gpsError && (
                  <p className="mt-2 text-sm text-red-500">{gpsError}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <InputField
              label="Phone Number"
              name="phone_number"
              value={setting.phone_number}
              onChange={handleSettingChange}
              required
            />

            {/* Email */}
            <InputField
              label="Public Email and Notification Email"
              name="public_email"
              value={setting.displayable_email}
              onChange={handleSettingChange}
              required
            />

            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="rounded-xl bg-pink-500 px-6 py-3 mt-2 text-white disabled:opacity-50"
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>

            {/* Logo */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Logo
              </label>

              <div className="flex items-center gap-4">
                {setting.logo ? (
                  <img
                    src={getLogoUrl(setting.logo)}
                    alt="Store Logo"
                    className="h-16 w-16 rounded-2xl object-cover border"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-pink-50">
                    <ImageOff size={24} className="text-pink-400" />
                  </div>
                )}

                <label className="flex h-16 flex-1 cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-5 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <ImagePlus size={18} className="text-gray-400" />

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Replace image
                      </p>

                      <p className="text-xs text-gray-400">
                        PNG, JPG up to 2 MB
                      </p>
                    </div>
                  </div>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={uploadLogo}
            disabled={savingLogo}
            className="rounded-xl bg-pink-500 px-6 py-3 mt-4 text-white disabled:opacity-50"
          >
            {savingLogo ? "Uploading..." : "Save Logo"}
          </button>
        </div>

        {/* ========================= */}
        {/* BUSINESS HOURS */}
        {/* ========================= */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-pink-100 p-2 text-pink-500">
              <Clock3 size={16} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Business Hours
              </h2>

              <p className="text-xs text-gray-400">
                Set weekday and weekend opening hours
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* WEEKDAYS */}
            <BusinessHourGroup
              label="Mon - Fri"
              data={businessHours.filter((d) =>
                [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                ].includes(d.day_of_week),
              )}
              onUpdate={(field, value) => {
                setBusinessHours((prev) =>
                  prev.map((item) =>
                    [
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                    ].includes(item.day_of_week)
                      ? { ...item, [field]: value }
                      : item,
                  ),
                );
              }}
            />

            {/* WEEKEND */}
            <BusinessHourGroup
              label="Weekend"
              data={businessHours.filter((d) =>
                ["saturday", "sunday"].includes(d.day_of_week),
              )}
              onUpdate={(field, value) => {
                setBusinessHours((prev) =>
                  prev.map((item) =>
                    ["saturday", "sunday"].includes(item.day_of_week)
                      ? { ...item, [field]: value }
                      : item,
                  ),
                );
              }}
            />
          </div>

          <button
            onClick={saveBusinessHours}
            disabled={savingHours}
            className="rounded-xl bg-pink-500 px-6 py-3 text-white disabled:opacity-50"
          >
            {savingHours ? "Saving..." : "Save Business Hours"}
          </button>
        </div>

        {/* Notifications */}
        <NotificationSetting />
      </div>
    </div>
  );
}
