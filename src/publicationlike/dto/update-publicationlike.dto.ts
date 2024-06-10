import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationlikeDto } from './create-publicationlike.dto';

export class UpdatePublicationlikeDto extends PartialType(CreatePublicationlikeDto) {}
