export interface TicketListModel {
  id: string;
  ticketStatus?: string;
  listing?: ListingModel;
}

export interface ListingModel {
  id: string;
  title?: string;
  imageThumnailUrl?: string;
  location?: any;
  bedrooms?: number;
  bathrooms?: number;
  priorityStatus?: number;
  priceUsd?: number;
  type?: number;
  ticketStatus?: string;
}
