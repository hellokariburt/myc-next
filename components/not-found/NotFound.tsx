'use client';

import '@mantine/core/styles.css';
import { Card } from '@mantine/core';
import PageLayout from '../pagelayout/PageLayout';

const NotFound = () => (
    <PageLayout className="h-[100%] items-center">
      <div className="flex flex-col items-center justify-center py-36 h-full ">
        <Card className="flex flex-1 bg-slate-500 pt-32 max-w-[800px]">
          <h1>
            {' '}
            <span className="font-bold">No Mics Found</span>
          </h1>
          <p>Sorry try the search again!</p>
        </Card>
      </div>
    </PageLayout>
);

export default NotFound;

export type NotFoundProps = {};
