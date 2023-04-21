/*
Copyright 2023 Dynatrace LLC.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Page as Page, AppHeader } from '@dynatrace/strato-components-preview';
import React, { useState } from 'react';
import { SideBarContent } from './components/SideBarContent';
import { Home } from './pages/Home';

export const App = () => {
  const [isDismissed, changeDismissState] = useState<boolean>(false);

  return (
    <Page>
      <Page.Header>
        <AppHeader />
      </Page.Header>
      <Page.Main>
        <Home />
      </Page.Main>
      <Page.DetailView
        onDismissChange={(state) => {
          changeDismissState(state);
        }}
        dismissed={isDismissed}
        preferredWidth='400px'
      >
        <SideBarContent onClose={() => changeDismissState(true)} />
      </Page.DetailView>
    </Page>
  );
};
