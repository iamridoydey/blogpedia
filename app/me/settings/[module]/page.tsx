/* eslint-disable @typescript-eslint/no-explicit-any */
import BasicInfo from "@/app/components/me/settings/BasicInfo";
import DeleteAccount from "@/app/components/me/settings/DeleteAccount";
import Security from "@/app/components/me/settings/Security";
import SocialAccounts from "@/app/components/me/settings/SocialAccounts";

export default function SettingsModule({ params }: { params: any }) {
  const { module } = params;

  let content;

  // Handle the switch logic
  switch (module) {
    case "basicinfo":
      content = <BasicInfo />;
      break;
    case "security":
      content = <Security />;
      break;
    case "socialAccounts":
      content = <SocialAccounts />;
      break;
    case "deleteAccount":
      content = <DeleteAccount />;
      break;
    default:
      content = <div>Default Module Content</div>;
  }

  return <>{content}</>;
}
