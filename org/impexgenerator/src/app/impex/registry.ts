import { ImpexTypeDescriptor } from './field.types';
import { categoryDescriptor } from './types/category';
import { cmsLinkComponentDescriptor } from './types/cms-link-component';
import { contentSlotDescriptor } from './types/content-slot';
import { featureFlagDescriptor } from './types/feature-flag';
import { pageDescriptor } from './types/page';
import { paragraphDescriptor } from './types/paragraph';
import { priceRowDescriptor } from './types/price-row';
import { productDescriptor } from './types/product';
import { productImagesDescriptor } from './types/product-images';

export const IMPEX_TYPES: ImpexTypeDescriptor[] = [
  featureFlagDescriptor,
  paragraphDescriptor,
  pageDescriptor,
  productImagesDescriptor,
  productDescriptor,
  categoryDescriptor,
  cmsLinkComponentDescriptor,
  contentSlotDescriptor,
  priceRowDescriptor,
];
