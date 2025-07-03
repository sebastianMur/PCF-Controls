import { makeStyles, tokens } from '@fluentui/react-components';
import { useAppSelector } from '@utils/hooks';
import { mockTemplateData } from '@utils/settings/data/mock-data';
import { selectTemplateMode } from '@utils/store';
import type TemplateData from '@utils/types/utility-types';
import { useState } from 'react';
import TemplateBuilder from './template-builder';
import TemplateCompletion from './template-completion';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  tabContent: {
    marginTop: tokens.spacingVerticalXL,
  },
});

export default function TemplateTabs() {
  const selectedTab = useAppSelector(selectTemplateMode);
  console.log('🚀 ~ TemplateTabs ~ selectedTab:', selectedTab);
  const [templateData, setTemplateData] = useState<TemplateData>(mockTemplateData);
  const styles = useStyles();

  // const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
  //   setSelectedTab(data.value as string);
  // };

  return (
    <div className={styles.container}>
      {/* <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <Tab id='design' value='design' icon={<Edit20Regular />}>
          Template Design
        </Tab>
        <Tab id='completion' value='completion' icon={<Edit20Regular />}>
          Template Completion
        </Tab>
      </TabList> */}

      <div className={styles.tabContent}>
        {selectedTab === 'design' && <TemplateBuilder templateData={templateData} onTemplateChange={setTemplateData} />}
        {selectedTab === 'completion' && <TemplateCompletion templateData={templateData} onTemplateChange={setTemplateData} />}
      </div>
    </div>
  );
}
