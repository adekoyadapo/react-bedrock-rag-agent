import Options from './Options';

const GeneralOptions = (props) => {
  const options = [
    {
      name: 'Account Onboarding',
      handler: props.actionProvider.AccountOnboarding,
      id: 1,
    },
    {
      name: 'VPC Creation',
      handler: props.actionProvider.VpcCreation,
      id: 2,
    },
    {
      name: 'Create a ServiceNow request',
      handler: props.actionProvider.Support,
      id: 3,
    },
    {
      name: 'Query Knowledge Base',
      handler: props.actionProvider.handleUserKb,
      id: 4,
    },
  ];
  return <Options options={options} {...props} />;
};

export default GeneralOptions;
