import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationlikeDto } from './create-publicationlike.dto';
import { IsInt } from 'class-validator';

export class UpdatePublicationlikeDto extends PartialType(CreatePublicationlikeDto) {
}
