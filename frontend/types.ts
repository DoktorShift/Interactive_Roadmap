export interface Feature {
  id: number
  name: string
  description: string
  status: "Idea" | "Planned" | "Progress" | "Launched"
  upvotes: number
  donationTotal: number
  target: number
  lnurlp: string
  lnurl: string
  comments: string[]
}

export interface Payment {
  lnurlp_id?: string
  amount: number
  comment: string
}

