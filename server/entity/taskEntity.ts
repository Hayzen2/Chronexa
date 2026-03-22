import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { TaskStatus } from "../enum/taskStatus.ts";
import { User } from "./userEntity.ts";

@Entity()
export class Task {
    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description?: string | null;

    @ManyToOne(() => User, user => user.tasks)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    status!: TaskStatus;

    @Column()
    dueDate!: Date;

    @Column()
    userId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}