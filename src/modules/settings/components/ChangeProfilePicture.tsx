import { useEffect, useRef, useState, ChangeEvent } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";
import { useAppDispatch } from "@shared/store/hooks";

import { updateUserProfileImage } from "@shared/services/SettingsAPI";
import IconBtn from "@shared/components/IconBtn";
import Img from "@shared/components/Img";

export default function ChangeProfilePicture() {
  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.profile);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<
    string | ArrayBuffer | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // console.log(file)
    if (file) {
      setProfileImage(file);
      previewFile(file);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    try {
      // console.log("uploading...")
      if (!profileImage || !token) return;

      setLoading(true);
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      dispatch(updateUserProfileImage(token, formData))
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log("ERROR MESSAGE - ", (error as Error).message);
          setLoading(false);
        });
    } catch (error) {
      console.log("ERROR MESSAGE - ", (error as Error).message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileImage) {
      previewFile(profileImage);
    }
  }, [profileImage]);

  return (
    <>
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12 text-richblack-5">
        <div className="flex items-center gap-x-4">
          <Img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />

          <div className="space-y-2">
            <p className="font-medium">Change Profile Picture</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg, image/jpg"
              />

              <button
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer rounded-md py-2 px-5 font-semibold bg-richblack-200 text-richblack-900 hover:bg-richblack-900 hover:text-richblack-200 duration-300"
              >
                Select
              </button>

              <IconBtn
                text={loading ? "Uploading..." : "Upload"}
                onclick={handleFileUpload}
              >
                {!loading && <FiUpload className="text-lg" />}
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
