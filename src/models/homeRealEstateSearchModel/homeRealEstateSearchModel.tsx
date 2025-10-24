import {
  HandOverStatusEnum,
  LegalStatusEnum,
  ListingLeaseTermEnum,
  ListingSearchQueryDto,
  ListingTypeEnum,
  ListPriorityStatusEnum,
} from '@/ecom-sadec-api-client';

export interface ShortHomeRealEstateSearchModel {
  t?: ListingTypeEnum;

  c?: string[];
  v?: string[];
  br?: number[];
  prjs?: string[];
  ps?: ListPriorityStatusEnum;
  p?: string;
  rp?: [number, number];
  rpUsd?: [number, number];
  d?: string;
  w?: string;
  k?: string;
  inA?: string[];
  outA?: string[];
  lS?: LegalStatusEnum[];
  hS?: HandOverStatusEnum;
  lt?: ListingLeaseTermEnum;
  iPA?: boolean | string;
  i?: string[];
  f?: number;
  s?: number;
  sz?: [number, number];
  odb?: boolean;
  fmd?: string;
  tmd?: string;
  lan?: string[];
  page?: number;

  pb?: string; // poster broker id
}

export function convertTypeOfShortFilterListingParams(params: {
  [key: string]: any;
}): ShortHomeRealEstateSearchModel {
  const result: ShortHomeRealEstateSearchModel = { ...params };

  if (params.t) result.t = params.t as ListingTypeEnum;

  if (params.c) result.c = Array.isArray(params.c) ? params.c : [params.c];
  if (params.v) result.v = Array.isArray(params.v) ? params.v : [params.v];
  if (params.prjs) result.prjs = Array.isArray(params.prjs) ? params.prjs : [params.prjs];

  if (params.br)
    result.br = Array.isArray(params.br)
      ? params.br.map((br: string) => parseInt(br, 10))
      : [parseInt(params.br, 10)];
  if (params.ps) result.ps = params.ps as ListPriorityStatusEnum;
  if (params.rp)
    result.rp = Array.isArray(params.rp)
      ? (params.rp.map((rp: string) => parseInt(rp, 10)) as [number, number])
      : params.rp
        ? [parseInt(params.rp, 10), undefined]
        : undefined;
  if (params.rp)
    result.rpUsd = Array.isArray(params.rpUsd)
      ? (params.rpUsd.map((rpUsd: string) => parseInt(rpUsd, 10)) as [number, number])
      : undefined;
  if (params.sz)
    result.sz = Array.isArray(params.sz)
      ? (params.sz.map((sz: string) => parseInt(sz, 10)) as [number, number])
      : undefined;

  if (params.inA) result.inA = Array.isArray(params.inA) ? params.inA : [params.inA];
  if (params.outA) result.outA = Array.isArray(params.outA) ? params.outA : [params.outA];
  if (params.lS)
    result.lS = Array.isArray(params.lS)
      ? (params.lS.map((lS: string) => parseInt(lS, 10)) as LegalStatusEnum[])
      : undefined;

  if (params.hS) result.hS = parseInt(params.hS, 10) as HandOverStatusEnum;
  if (params.lt) result.lt = parseInt(params.lt, 10) as ListingLeaseTermEnum;
  if (params.iPA) result.iPA = params.iPA === 'true' || params.iPA === true;
  if (params.odb) result.odb = params.odb === 'true' || params.odb === true;

  if (params.f) result.f = parseFloat(params.f);
  if (params.s) result.s = parseFloat(params.s);
  if (params.page) result.page = parseFloat(params.page);

  return result;
}

function ensureArray<T>(input: T | T[]): T[] {
  if (Array.isArray(input)) {
    return input;
  }
  return [input];
}

export function convertToHomeRealEstateSearchModel(
  shortModel: ShortHomeRealEstateSearchModel,
): ListingSearchQueryDto {
  return {
    type: Number(shortModel.t) as ListingTypeEnum,
    projectIds: ensureArray(shortModel.prjs),
    categoryIds: ensureArray(shortModel.c),
    viewsIds: ensureArray(shortModel.v),
    bedrooms: shortModel.br ? ensureArray(shortModel.br)?.map((i) => Number(i)) : undefined,

    fromPriceVnd: shortModel.rp ? Number(shortModel.rp[0]) : undefined,
    toPriceVnd: shortModel.rp ? Number(shortModel.rp[1]) : undefined,
    fromPriceUsd: shortModel.rpUsd ? Number(shortModel.rpUsd[0]) : undefined,
    toPriceUsd: shortModel.rpUsd ? Number(shortModel.rpUsd[1]) : undefined,

    fromSize: shortModel.sz ? Number(shortModel.sz[0]) : undefined,
    toSize: shortModel.sz ? Number(shortModel.sz[1]) : undefined,

    priorityStatus: shortModel.ps ? (Number(shortModel.ps) as ListPriorityStatusEnum) : undefined,
    province: shortModel.p,
    district: shortModel.d,
    ward: shortModel.w,
    keyword: shortModel.k,
    inDoorAmenities: ensureArray(shortModel.inA),
    outDoorAmenities: ensureArray(shortModel.outA),
    legalStatus: shortModel.lS
      ? ensureArray(shortModel.lS)?.map((i) => Number(i) as LegalStatusEnum)
      : undefined,
    handOverStatus: shortModel.hS ? (Number(shortModel.hS) as HandOverStatusEnum) : undefined,
    leaseTerm: shortModel.lt ? (Number(shortModel.lt) as ListingLeaseTermEnum) : undefined,
    isPetAllowance: shortModel.iPA
      ? shortModel.iPA === 'true' || shortModel.iPA === true
      : undefined,
    interiorIds: ensureArray(shortModel.i),
    orderByCreatedTime: shortModel.odb ? true : undefined,
    fromMoveDate: shortModel.fmd,
    toMoveDate: shortModel.tmd,
    contentLanguage: ensureArray(shortModel.lan),

    from: (Number(shortModel.page ?? 1) - 1) * Number(shortModel.s),
    size: Number(shortModel.s),

    posterBrokerId: shortModel.pb,
  };
}
