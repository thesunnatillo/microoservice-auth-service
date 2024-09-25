import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
     id: number;

    @Column()
    fullname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'Employee' })
    role: string
}