import { expect } from "vitest"
import { render, screen } from '@testing-library/react'
import { Log } from '../src/assets/components/Log'
import App from "../src/App"
import userEvent from "@testing-library/user-event"
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js"

// Supabase のモック
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      // 最初の読み込み（useEffect）：記録は 0 件
      select: () => Promise.resolve({ data: [], error: null }),
      // 登録（onRegister）：登録した記録を返す
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({ data: { id: 1, title: 'Vitest', time: '2' }, error: null }),
        }),
      }),
    }),
  },
}))

describe('App', () => {             
  it('タイトルが表示される', () => {
    render(<Log records={[{ id: 1, title: 'React', time: 3 }]} onDelete={() => {}} />)
    const el = screen.getByText(/React/)
    expect(el).toBeInTheDocument()
  })            

  it(`登録ボタンで追加される`, async () => {
    const user = userEvent.setup();
      
    render(<App/>)

    await screen.findByText('0 / 1000(h)')

    await user.type(screen.getByPlaceholderText('学習記録を記載ください'), 'Vitest')

    await user.type(screen.getByPlaceholderText('学習記録を記載ください'), 'Vitest')

    const timeInput = screen.getByPlaceholderText('学習時間を記載ください')
    
    await user.clear(timeInput)

    await user.type(timeInput, '2')

    await user.click(screen.getByRole('button', { name: '登録' }))

    expect(await screen.findByText(/Vitest 2時間/)).toBeInTheDocument()

    expect(await screen.findByText('2 / 1000(h)')).toBeInTheDocument()
  })

  it('入力バリデーション', async () => {
    const user = userEvent.setup()

    render(<App/>)

    await screen.findByText('0 / 1000(h)')

    await user.click(screen.getByRole('button', { name: '登録' }))

    expect(await screen.getByText('入力されてない項目があります')).toBeInTheDocument()
  })
})


