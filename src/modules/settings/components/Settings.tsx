"use client";

import { useAppSelector } from "@shared/store/hooks";
import { ACCOUNT_TYPE } from "@shared/utils/constants";
import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings() {
  const { user } = useAppSelector((state) => state.profile);
  
  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        Edit Profile
      </h1>
      {/* Change Profile Picture */}
      <ChangeProfilePicture />
      {/* Profile */}
      <EditProfile />
      {/* Password */}
      <UpdatePassword />
      {/* Delete Account - Comentado para admins por si acaso */}
      {user?.accountType !== ACCOUNT_TYPE.ADMIN && <DeleteAccount />}
      {/* {user?.accountType === ACCOUNT_TYPE.ADMIN && <DeleteAccount />} */}
    </>
  );
}
