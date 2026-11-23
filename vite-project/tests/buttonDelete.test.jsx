import { expect } from "vitest"
import { render, screen, waitFor } from '@testing-library/react'
import App from "../src/App"
import userEvent from "@testing-library/user-event"

// Supabase のモック
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      // 最初の読み込み：記録が1件ある
      select: () =>
        Promise.resolve({ data: [{ id: 1, title: 'React', time: 3 }], error: null }),
      // 削除：成功したと返事をする
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}))

describe('Delete', () => {             
  it('消去', async () => {
    const user = userEvent.setup();
    render(<App />)

    expect(await screen.findByText(/React 3時間/)).toBeInTheDocument()
    expect(screen.getByText('3 / 1000(h)')).toBeInTheDocument()
    
    await user.click(screen.getByRole('button', {name: '削除'}))
    
    await waitFor(() => {
      expect(screen.queryByText(/React 3時間/)).not.toBeInTheDocument()
    })
    })  
})
