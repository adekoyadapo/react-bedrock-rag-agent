// QuickLinks.js
import { Button } from '@material-tailwind/react';

export default function QuickLinks({ onButtonClick }) {
  const ButtonClass =
    'flex-shrink-0 bg-[#00ABAB] hover:bg-[#009A44] font-sans font-light text-sm h-9';

  const handleButtonClick = (message) => {
    onButtonClick(message);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="filled"
        size="sm"
        className={`${ButtonClass}`}
        onClick={() => handleButtonClick('Account Onboarding')}
      >
        Account Onboarding
      </Button>
      <Button
        variant="filled"
        size="sm"
        className={`${ButtonClass}`}
        onClick={() => handleButtonClick('VPC Creation')}
      >
        VPC Creation
      </Button>
      <Button
        variant="filled"
        size="sm"
        className={`${ButtonClass}`}
        onClick={() => handleButtonClick('Create a ServiceNow Ticket')}
      >
        Support Ticket
      </Button>
      <Button
        variant="filled"
        size="sm"
        className={`${ButtonClass}`}
        onClick={() => handleButtonClick('Query Knowledge Base')}
      >
        Query Knowledge Base
      </Button>
    </div>
  );
}
