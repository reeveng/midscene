import path from 'node:path';
import { AiInspectElement } from '@/ai-model';
import { AiAssert } from '@/ai-model/inspect';
import { expect, it } from 'vitest';
import {
  getPageTestData,
  repeat,
  runTestCases,
  writeFileSyncWithDir,
} from './util';

const testTodoCases = [
  {
    description: '任务输入框',
    multi: false,
  },
  {
    description: '任务列表中的第二项',
    multi: false,
  },
  {
    description: '第二项任务右边的删除按钮',
    multi: false,
  },
  {
    description: '任务列表中第三项左边的勾选按钮',
    multi: false,
  },
  {
    description: '任务列表下面的 Completed 状态按钮',
    multi: false,
  },
];

repeat(2, (repeatIndex) => {
  it(
    'todo: inspect element',
    async () => {
      const { context } = await getPageTestData(
        path.join(__dirname, './test-data/todo'),
      );

      const { aiResponse, filterUnstableResult } = await runTestCases(
        testTodoCases,
        async (testCase) => {
          const { parseResult } = await AiInspectElement({
            context,
            multi: testCase.multi,
            findElementDescription: testCase.description,
          });
          return parseResult;
        },
      );
      writeFileSyncWithDir(
        path.join(
          __dirname,
          `__ai_responses__/todo-inspector-element-${repeatIndex}.json`,
        ),
        JSON.stringify(aiResponse, null, 2),
        { encoding: 'utf-8' },
      );
      expect(filterUnstableResult).toMatchFileSnapshot(
        './__snapshots__/todo_inspector.test.ts.snap',
      );
    },
    {
      timeout: 90 * 1000,
    },
  );
});

repeat(2, () => {
  it(
    'todo: assert',
    async () => {
      const { context } = await getPageTestData(
        path.join(__dirname, './test-data/todo'),
      );

      const { pass, thought } = await AiAssert({
        context,
        assertion: 'There are three tasks in the list',
      });

      expect(pass).toBeTruthy();
      expect(thought).toBeTruthy();

      const { pass: pass2, thought: thought2 } = await AiAssert({
        context,
        assertion: 'There is an button to sort the list in a time order',
      });

      expect(pass2).toBeFalsy();
      expect(thought2).toBeTruthy();
    },
    {
      timeout: 90 * 1000,
    },
  );
});
