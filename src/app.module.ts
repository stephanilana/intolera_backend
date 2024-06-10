import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PasswordModule } from "./password/password.module";
import { CertificationModule } from "./certification/certification.module";
import { ProfileModule } from "./profile/profile.module";
import { FollowerModule } from "./follower/follower.module";
import { PublicationModule } from "./publication/publication.module";
import { PublicationlikeModule } from "./publicationlike/publicationlike.module";
import { CommentModule } from "./comment/comment.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://lanastephani:ZKRgoql5Wpv10uuo@intolera.ft0enle.mongodb.net/"),
    UsersModule,
    PasswordModule,
    CertificationModule,
    ProfileModule,
    FollowerModule,
    PublicationModule,
    PublicationlikeModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
